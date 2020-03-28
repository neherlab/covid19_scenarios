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
        elif county == '':
            # we have state data
            index['cases'] = hdr.index('province_confirmedCount')
            index['deaths'] = hdr.index('province_deadCount')
            index['recovered'] = hdr.index('province_curedCount')
            #try:
            #    code = list(countries.keys())[list(countries.values()).index(country)]
            #except:
            #    print(f'No code for country {country}')
            #    continue
            #country = '-'.join([code,state])
            country = state
        else:
            # we have county data
            continue
            index['cases'] = hdr.index('city_confirmedCount')
            index['deaths'] = hdr.index('city_deadCount')
            index['recovered'] = hdr.index('city_curedCount')
            try:
                code = list(countries.keys())[list(countries.values()).index(country)]
            except:
                print(f'No code for country {country}')
                continue
            country = '-'.join([code,state,county])

        if not country in cases:
            cases[country] = []
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
            cases[country].append(d)
        else:
            #print(f'we actually have double data per date for {country} for date {date_str} {row}')
            continue

    # now we need to merge county data?

            # check if we already have data, likely from another county in this state, if available. In that case, we need to add
            #try:
            #    od = next(x for x in cases[codeState] if x['time']==date_str)
            #    d = {'time': date_str}
            #    for i in cols[1:]:
            #        if i in index:
            #            if len(row[index[i]])>0:
            #                if not i in od:
            #                    od[i] = int(float(row[index[i]]))
            #                else:
            #                    od[i] += int(float(row[index[i]]))
            #except (StopIteration, KeyError) as e:
            #    # first observation for that date and
            #    d = {'time': date_str}
            #    for i in cols[1:]:
            #        if i in index:
            #            if len(row[index[i]])>0:
            #                d[i] = int(float(row[index[i]]))
            #    cases[codeState].append(d)

    # sort chronologically
    for cntry, data in cases.items():
        cases[cntry] = sorted_date(cases[cntry])
    #import json
    #print(json.dumps(cases))
    store_data(cases, {'default': LOC, 'China': LOC}, 'china', 'CHN', cols=cols)
