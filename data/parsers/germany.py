import sys
import requests
import csv
import io

from collections import defaultdict
from .utils import store_data

# ------------------------------------------------------------------------
# Globals

bundesland_codes = {
   "BW": "Baden-Württemberg",
   "BY": "Bayern",
   "BE": "Berlin",
   "BB": "Brandenburg",
   "HB": "Bremen",
   "HH": "Hamburg",
   "HE": "Hessen",
   "MV": "Mecklenburg-Vorpommern",
   "NI": "Niedersachsen",
   "NW": "Nordrhein-Westfalen",
   "RP": "Rheinland-Pfalz",
   "SL": "Saarland",
   "SN": "Sachsen",
   "ST": "Sachsen-Anhalt",
   "SH": "Schleswig-Holstein",
   "TH": "Thüringen",
}

URL  = "https://raw.githubusercontent.com/chriswien/COVID19_CaseNumberDE/master/COVID19_Cases_Bundeslaender_DE.csv"
LOC  = "case-counts/Europe/Western Europe/Germany"
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
        print(f"Failed to fetch {URL}", file=sys.stderr)
        exit(1)
        r.close()

    regions = defaultdict(list)
    fd  = io.StringIO(r.text)
    rdr = csv.reader(fd)
    hdr = next(rdr)

    for row in rdr:
        date   = row[0]
        if row[1] in bundesland_codes:
            bundesland = '-'.join(['DEU', bundesland_codes[row[1]]])
            regions[bundesland].append([date, to_int(row[2]), to_int(row[3]), None, None, None])

    store_data(regions,  'germany', cols)
