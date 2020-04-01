import sys
import requests
import csv
import io
from datetime import datetime

from .utils import sorted_date, store_data, parse_countries

# ------------------------------------------------------------------------
# Globals

URL  = "https://github.com/BlankerL/DXY-COVID-19-Data/raw/master/csv/DXYArea.csv"
LOC  = "case-counts/Asia/Eastern Asia/China"
cols = ['time', 'cases', 'deaths', 'hospitalized', 'ICU', 'recovered']

# ------------------------------------------------------------------------
# Functions

# ------------------------------------------------------------------------
# Main point of entry

def parse():
    countries = parse_countries(2)

    r  = requests.get(URL)
    if not r.ok:
        print(f"Failed to fetch {URL}", file=sys.stderr)
        exit(1)
    cases  = {}
    aggregates = {} # aggregate per state and use later if no direct state-level data available
    dates = {}
    fd  = io.StringIO(r.text)
    rdr = csv.reader(fd)
    hdr = next(rdr)
    index = {}
    index['country'] = hdr.index('countryEnglishName')
    index['state'] = hdr.index('provinceEnglishName')
    index['county'] = hdr.index('cityEnglishName')
    index['time'] = hdr.index('updateTime')
    for row in rdr:
        date_str = datetime.strptime(row[index['time']], r"%Y-%m-%d %H:%M:%S").strftime(r"%Y-%m-%d")
        # we only care about country and state-level data
        country = row[index['country']]
        state = row[index['state']]
        county = row[index['county']]
        if not country == 'China' or state == 'Taiwan':
            # let's only pull China data for now
            continue
        
        if not country in cases:
           cases[country] = []
           dates[country] = {}
        if country == state:
            # we have only country level data
            index['cases'] = hdr.index('province_confirmedCount')
            index['deaths'] = hdr.index('province_deadCount')
            index['recovered'] = hdr.index('province_curedCount')
            mycases = cases
        elif county == '':
            # we have state data
            index['cases'] = hdr.index('province_confirmedCount')
            index['deaths'] = hdr.index('province_deadCount')
            index['recovered'] = hdr.index('province_curedCount')
            country = state
            mycases = cases
        else:
            # we have county data
            index['cases'] = hdr.index('city_confirmedCount')
            index['deaths'] = hdr.index('city_deadCount')
            index['recovered'] = hdr.index('city_curedCount')
            mycases = aggregates
            country = '-'.join([state,county])

        if not country in mycases:
            mycases[country] = []
            dates[country] = {}
        if not date_str in dates[country]:
            dates[country][date_str] = True
            d = {'time':date_str}
            for i in cols[1:]:
                if i in index:
                    if len(row[index[i]])>0:
                        d[i] = int(float(row[index[i]]))
                    else:
                        d[i] = None
                else:
                    d[i] = None
            mycases[country].append(d)
        else:
            #print(f'we actually have double data per date for {country} for date {date_str} {row}')
            continue

    # add up county numbers to province numbers
    aggregates2 = {}
    for cntry, data in cases.items():        
        # for each state, pull all counties
        for c in [value for key, value in aggregates.items() if cntry in key]:
            # we now have a list of dicts for the county
            if not cntry in aggregates2:
                aggregates2[cntry] = []
            for d in c: # each day for the counties
                try:
                    # check if we have data for that day already
                    od = next(x for x in aggregates2[cntry] if x['time']==d['time'])
                    # we found prior data, update it. There should only be one match here
                    for k in cols[1:]:
                        if (k in od) and (od[k]) and (k in d):
                            if d[k]:
                                od[k] += d[k]
                        elif k in d:
                            od[k] = d[k]
                except (StopIteration, KeyError) as e:
                    # first observation for that date and
                    aggregates2[cntry].append(d)
                
    # now update cases if we don't have values for a specific day
    for cntry, data in aggregates2.items():        
        # for each state, pull all counties
        for d in data: # each day, a dict
            try:
                # check if we have data for that day already
                od = next(x for x in cases[cntry] if x['time']==d['time'])
                # we found prior data, don't do anything
            except (StopIteration, KeyError) as e:
                # first observation for that date and
                cases[cntry].append(d)

    # sort chronologically, update keys
    cases2 = {}
    for cntry, data in cases.items():
        if not cntry == 'China':
            cases2['-'.join(['CHN',cntry])] = sorted_date(data)
        else:
            cases2[cntry] = sorted_date(data)

    store_data(cases2, 'china', cols=cols)
