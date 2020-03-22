import os, sys
import csv
import json
import requests
import numpy as np

from collections import defaultdict
from datetime import datetime
from .utils import write_tsv, list_to_dict, store_json

# ------------------------------------------------------------------------
# Globals

URL  = "https://api.rootnet.in/covid19-in/stats/daily"
LOC  = "case-counts/Asia/Southern Asia/India"
cols = ['time', 'cases', 'deaths', 'hospitalized', 'ICU', 'recovered']

# ------------------------------------------------------------------------
# Functions

def sorted_date(s):
    return sorted(s, key=lambda d: datetime.strptime(d[cols.index('time')], "%Y-%m-%d"))

# ------------------------------------------------------------------------
# Main point of entry

def parse():
    r  = requests.get(URL)
    if not r.ok:
        print(f"Failed to fetch {URL}", file=sys.stderr)
        exit(1)
        r.close()

    dbindia = json.loads(r.text)['data']
    r.close()

    # Convert to ready made TSVs
    states = defaultdict(list)
    for row in dbindia:
        dates = row["day"]
        for i in row['regional']:
            confirmedCases = 0
            if i["confirmedCasesIndian"]:
                confirmedCases += i["confirmedCasesIndian"]
            if i["confirmedCasesForeign"]:
                confirmedCases += i["confirmedCasesForeign"]

            deaths = i["deaths"]
            locations = i['loc']
            elt  = [ dates, confirmedCases, deaths, None, None, None ]
            states[locations].append(elt)

    for cntry, data in states.items():
        states[cntry] = sorted_date(states[cntry])

    for state, data in states.items():
        try:
            state = state.replace(' / ','_')
            write_tsv(f"{LOC}/{state}.tsv", cols, data, "india")
        except FileNotFoundError as e:
            print(f"dumping data for '{state}' failed.")
            raise e

    # prepare dict for json
    regions2 = {}
    for region, data in states.items():
        if not (region == "India"):
            regions2["IND-"+region] = data
        else:
            regions2[region] = data

    regions3 = list_to_dict(regions2, cols)
    store_json(regions3)
