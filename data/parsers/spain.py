import sys
import requests
import csv
import io
from datetime import datetime

from collections import defaultdict
from .utils import store_data

# ------------------------------------------------------------------------
# Globals

deaths_URL =       "https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/ccaa_covid19_fallecidos.csv"
cases_URL =        "https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/ccaa_covid19_casos.csv"
hospitalized_URL = "https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/ccaa_covid19_hospitalizados.csv"
ICU_URL =          "https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/ccaa_covid19_uci.csv"
recovered_URL =    "https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/ccaa_covid19_altas.csv"

LOC  = "case-counts/Europe/Southern Europe/Spain"
cols = ['time', 'cases', 'deaths', 'hospitalized', 'ICU', 'recovered']

# ------------------------------------------------------------------------
# Functions

def to_int(x):
    if x == "NA" or x == "":
        return None
    else:
        return int(x)

# ------------------------------------------------------------------------
# Main point of entry

def parse():
    # read individual files into dicts of dicts by region
    deaths, cases, hospitalized, ICU, recovered = defaultdict(dict), defaultdict(dict), defaultdict(dict), defaultdict(dict), defaultdict(dict)
    for d, URL in [(deaths, deaths_URL), (cases, cases_URL), (hospitalized, hospitalized_URL), (ICU, ICU_URL), (recovered, recovered_URL)]:
        r  = requests.get(URL)
        if not r.ok:
            print(f"Failed to fetch {URL}", file=sys.stderr)
            exit(1)
            r.close()

        fd  = io.StringIO(r.text)
        rdr = csv.reader(fd)
        hdr = next(rdr)
        dates = [x for x in hdr[2:]]
        # dates = [datetime.strptime(x, "%d/%m/%Y").strftime('%Y-%m-%d') for x in hdr[2:]]
        for row in rdr:
            region   = row[1]
            for val, date in zip(row[2:], dates):
                d[region][date] = to_int(val)

    # combine different data into one dict per region and day
    region_data = defaultdict(lambda: defaultdict(dict))
    for field, data in ('deaths', deaths), ('cases', cases), ('hospitalized', hospitalized), ('ICU', ICU), ('recovered', recovered):
        for region, d in data.items():
            for date in d:
                region_data[region][date][field] = d[date]

    # convert dict of dicts into dict of lists
    region_tables = {}
    for region, d in region_data.items():
        dps = sorted(d.items())
        region_tables['-'.join(['ESP',region])]  = [[x[0], x[1].get("cases", None),
                                         x[1].get("deaths",None),
                                         x[1].get("hospitalized",None),
                                         x[1].get("ICU", None),
                                         x[1].get("recovered", None)] for x in dps]

    region_tables['Spain'] = region_tables['ESP-Total']
    del region_tables['ESP-Total']
    
    store_data(region_tables, 'spain', cols)
