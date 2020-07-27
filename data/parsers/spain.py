import sys
import requests
import csv
import io
from datetime import datetime

from collections import defaultdict
from .utils import store_data, stoi

# ------------------------------------------------------------------------
# Globals

deaths_URL =       "https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/ccaa_covid19_fallecidos.csv"
cases_URL =        "https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/ccaa_covid19_casos.csv"
hospitalized_URL = "https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/ccaa_covid19_hospitalizados.csv"
icu_URL =          "https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/ccaa_covid19_uci.csv"
recovered_URL =    "https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/ccaa_covid19_altas.csv"
cols = ['time', 'cases', 'deaths', 'hospitalized', 'icu', 'recovered']

# ------------------------------------------------------------------------
# Main point of entry

def parse():
    # read individual files into dicts of dicts by region
    deaths, cases, hospitalized, icu, recovered = defaultdict(dict), defaultdict(dict), defaultdict(dict), defaultdict(dict), defaultdict(dict)
    for d, URL in [(deaths, deaths_URL), (cases, cases_URL), (hospitalized, hospitalized_URL), (icu, icu_URL), (recovered, recovered_URL)]:
        r  = requests.get(URL)
        if not r.ok:
            print(f"Failed to fetch {URL}", file=sys.stderr)
            exit(1)
            r.close()

        fd  = io.StringIO(r.text)
        rdr = csv.reader(fd)
        hdr = next(rdr)
        dates = [x for x in hdr[2:]]
        for row in rdr:
            region   = row[1]
            for val, date in zip(row[2:], dates):
                d[region][date] = stoi(val)

    # combine different data into one dict per region and day
    region_data = defaultdict(lambda: defaultdict(dict))
    for field, data in ('deaths', deaths), ('cases', cases), ('hospitalized', hospitalized), ('icu', icu), ('recovered', recovered):
        for region, d in data.items():
            for date in d:
                region_data[region][date][field] = d[date]

    # convert dict of dicts into dict of lists
    regions = {}
    for region, d in region_data.items():
        dps = sorted(d.items())
        regions['-'.join(['ESP',region])]  = [[x[0], x[1].get("cases", None),
                                         x[1].get("deaths",None),
                                         x[1].get("hospitalized",None),
                                         x[1].get("icu", None),
                                         x[1].get("recovered", None)] for x in dps]

    # Delete incorrect data, see https://github.com/neherlab/covid19_scenarios/issues/595

    for r in regions:
        if r == 'ESP-Madrid':
            for d in regions[r]:
                stop = datetime.strptime('2020-04-26', '%Y-%m-%d')
                if datetime.strptime(d[cols.index('time')], '%Y-%m-%d') >= stop:
                    d[cols.index('hospitalized')] = None
                    d[cols.index('icu')] = None
        elif r == 'ESP-Galicia':
            for d in regions[r]:
                d[cols.index('hospitalized')] = None
        elif r == 'ESP-Castilla-La Mancha':
            for d in regions[r]:
                stop = datetime.strptime('2020-04-12', '%Y-%m-%d')
                if datetime.strptime(d[cols.index('time')], '%Y-%m-%d') >= stop:
                    d[cols.index('hospitalized')] = None
                    d[cols.index('icu')] = None
        elif r == 'SP-Castilla y León':
            for d in regions[r]:
                stopHosp = datetime.strptime('2020-04-07', '%Y-%m-%d')
                stopICU = datetime.strptime('2020-04-17', '%Y-%m-%d')
                if datetime.strptime(d[cols.index('time')], '%Y-%m-%d') >= stopHosp:
                    d[cols.index('hospitalized')] = None
                if datetime.strptime(d[cols.index('time')], '%Y-%m-%d') >= stopICU:
                    d[cols.index('icu')] = None
        elif r == 'ESP-C. Valenciana':
            for d in regions[r]:
                stop = datetime.strptime('2020-04-09', '%Y-%m-%d')
                if datetime.strptime(d[cols.index('time')], '%Y-%m-%d') >= stop:
                    d[cols.index('hospitalized')] = None
                    d[cols.index('icu')] = None
        else:
            # none of the data is current, it is cumulative. We delete it for now
            for d in regions[r]:
                d[cols.index('hospitalized')] = None
                d[cols.index('icu')] = None

    # For totals, we actually only use the recovered data in the end, as hosp+icu are None, and cases and deaths are taken from ecdc data
    try:
        regions['Spain'] = regions['ESP-Total']
        del regions['ESP-Total']
    except:
        print("  /!\ Warning: totals don't exist for Spain")

    store_data(regions, 'spain', cols)
