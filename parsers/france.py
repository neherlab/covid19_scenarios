import sys
import requests
import csv
import io

from collections import defaultdict
from .utils import write_tsv

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

    for row in rdr:
        if row[1] == 'region':
            date   = row[0]
            region = row[3].replace(" ", "-").replace("Î", "I").replace("'", "").replace("’", "")
            cases = to_int(row[4])
            death = to_int(row[5])

            if region not in regions:
                regions[region] = {}

            if date not in regions[region]:
                regions[region][date] = [date, cases, death, None, None, None]
                continue

            # If data from another source is bigger, we take it
            if cases is not None and (regions[region][date][1] is None or cases > regions[region][date][1]):
                regions[region][date][1] = cases

            if death is not None and (regions[region][date][2] is None or death > regions[region][date][2]):
                regions[region][date][2] = death
            

    for region, dates in regions.items():
        write_tsv(f"{LOC}/{region}.tsv", cols, [data for date,data in dates.items()], "france")

