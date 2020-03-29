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
            hospitalized = to_int(row[7])
            ICU = to_int(row[6])

            if region not in regions:
                regions[region] = {}

            if date not in regions[region]:
                regions[region][date] = [date, cases, death, hospitalized, ICU, None]
                continue

            # If data from another source is bigger, we take it
            if cases is not None and (regions[region][date][1] is None or cases > regions[region][date][1]):
                regions[region][date][1] = cases

            if death is not None and (regions[region][date][2] is None or death > regions[region][date][2]):
                regions[region][date][2] = death
                
            if hospitalized is not None and (regions[region][date][3] is None or hospitalized > regions[region][date][3]):
                regions[region][date][3] = hospitalized
                
            if ICU is not None and (regions[region][date][4] is None or ICU > regions[region][date][4]):
                regions[region][date][4] = ICU

    regions2 = {}
    for reg, d in regions.items():
        regions2[reg] = [d[day] for day in sorted(d.keys()) if d[day][1]]

    store_data(regions2, { 'default': LOC}, 'france', 'FRA', cols)
