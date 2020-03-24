import sys
import requests
import csv
import io

from collections import defaultdict
from .utils import store_data

# ------------------------------------------------------------------------
# Globals

URL  = "https://github.com/opencovid19-fr/data/raw/master/dist/chiffres-cles.csv"
LOC  = "case-counts/Europe/Western Europe/France"
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
    r  = requests.get(URL)
    if not r.ok:
        print("Failed to fetch {URL}", file=sys.stderr)
        exit(1)
        r.close()

    regions = defaultdict(list)
    fd  = io.StringIO(r.text)
    rdr = csv.reader(fd)
    hdr = next(rdr)

    last_deaths=defaultdict(int)
    last_cases=defaultdict(int)
    last_hospitalized=defaultdict(int)
    for row in rdr:
        if row[1] == 'region':
            date   = row[0]
            region = row[3]
            last_cases[region] = max(int(row[4]), last_cases[region]) if row[4] else last_cases[region]
            last_deaths[region] = max(int(row[5]), last_deaths[region]) if row[5] else last_deaths[region]
            last_hospitalized[region] = max(int(row[7]), last_hospitalized[region]) if row[7] else last_hospitalized[region]
            regions[region].append([date, last_cases[region], last_deaths[region], last_hospitalized[region], None, None])


    store_data(regions, { 'default': LOC}, 'france', 'FRA', cols)
