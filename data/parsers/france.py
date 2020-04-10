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
cols = ['time', 'cases', 'deaths', 'hospitalized', 'icu', 'recovered']

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

    regions = {}
    fd  = io.StringIO(r.text)
    rdr = csv.reader(fd)
    hdr = next(rdr)

    last_deaths=defaultdict(int)
    last_cases=defaultdict(int)
    last_hospitalized=defaultdict(int)
    for row in rdr:
        if row[1] == 'region':
            date   = row[0]
            region = row[3].replace(" ", "-").replace("Î", "I").replace("'", "").replace("’", "")
            cases = to_int(row[4])
            death = to_int(row[5])
            hospitalized = to_int(row[8])
            icu = to_int(row[7])

            if region not in regions:
                regions[region] = {}

            if date not in regions[region]:
                regions[region][date] = [date, cases, death, hospitalized, icu, None]
                continue

            # If data from another source is bigger, we take it
            if cases is not None and (regions[region][date][1] is None or cases > regions[region][date][1]):
                regions[region][date][1] = cases

            if death is not None and (regions[region][date][2] is None or death > regions[region][date][2]):
                regions[region][date][2] = death
                
            if hospitalized is not None and (regions[region][date][3] is None or hospitalized > regions[region][date][3]):
                regions[region][date][3] = hospitalized
                
            if icu is not None and (regions[region][date][4] is None or icu > regions[region][date][4]):
                regions[region][date][4] = icu

    regions2 = {}
    for reg, d in regions.items():
        regions2['-'.join(['FRA',reg])] = [d[day] for day in sorted(d.keys())]

    store_data(regions2, 'france',  cols)
