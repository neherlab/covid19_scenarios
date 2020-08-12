import sys
import json
import requests

from collections import defaultdict
from datetime import datetime
from .utils import store_data

# ------------------------------------------------------------------------
# Globals

URL  = "https://api.rootnet.in/covid19-in/stats/daily"
cols = ['time', 'cases', 'deaths', 'hospitalized', 'icu', 'recovered']

# ------------------------------------------------------------------------
# Functions

def sorted_date(s):
    return sorted(s, key=lambda d: datetime.strptime(d[cols.index('time')], "%Y-%m-%d"))


place_map = {'Telangana***': 'Telangana', 'Telengana':'Telangana'}

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

            loc = i['loc'].replace('#','')
            location = '-'.join(['IND',place_map.get(loc,loc)])
            elt  = [ dates, confirmedCases, deaths, None, None, None ]
            states[location].append(elt)

    for cntry, data in states.items():
        states[cntry] = sorted_date(states[cntry])

    store_data(states, 'india', cols)
