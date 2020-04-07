import sys
import requests
import csv
import io
from datetime import datetime

from .utils import store_data

# ------------------------------------------------------------------------
# Globals

URL  = "https://raw.githubusercontent.com/idandrd/israel-covid19-data/master/IsraelCOVID19.csv"
LOC  = "case-counts/Asia/Western Asia/Israel"
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
        print(f"Failed to fetch {URL}", file=sys.stderr)
        exit(1)
        r.close()
    il_data = dict(Israel=[])
    fd  = io.StringIO(r.text)
    rdr = csv.reader(fd)
    hdr = next(rdr)
    for row in rdr:
        date_str = datetime.strptime(row[0], r"%d/%m/%Y").strftime(r"%Y-%m-%d")
        num_cases = to_int(row[1])
        num_icus = to_int(row[4])
        num_deaths = to_int(row[5])
        il_data["Israel"].append([date_str, num_cases, num_deaths, None, num_icus, None])

    store_data(il_data, 'israel', cols=cols)
