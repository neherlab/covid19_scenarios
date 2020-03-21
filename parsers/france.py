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

    regions = defaultdict(list)
    fd  = io.StringIO(r.text)
    rdr = csv.reader(fd)
    hdr = next(rdr)

    for row in rdr:
        if row[1] == 'region':
            date   = row[0]
            region = row[3]
            regions[region].append([date, to_int(row[4]), to_int(row[5]), None, None, None])


    for region, data in regions.items():
        write_tsv(f"{LOC}/{region}.tsv", cols, data, "france")
