import os, sys
import csv
import json
import requests
import numpy as np
import json

from collections import defaultdict
from datetime import datetime
from .utils import write_tsv, store_json, list_to_dict, stoi

# ------------------------------------------------------------------------
# Globals

acronyms = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "FL": "Florida",
    "GA": "Georgia",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PA": "Pennsylvania",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming",
    "AS": "American Samoa",
    "DC": "District of Columbia",
    "FM": "Federated States of Micronesia",
    "GU": "Guam",
    "MH": "Marshall Islands",
    "MP": "Northern Mariana Islands",
    "PW": "Palau",
    "PR": "Puerto Rico",
    "VI": "Virgin Islands",
}

URL  = "https://covidtracking.com/api/states/daily"
LOC  = "case-counts/Americas/Northern America/United States of America"
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

    db = json.loads(r.text)
    r.close()

    # Convert to ready made TSVs
    regions = defaultdict(list)
    for row in db:
        date = str(row["date"])
        date = f"{date[0:4]}-{date[4:6]}-{date[6:8]}"
        elt  = [ date, stoi(row["positive"]), stoi(row["death"]), None, None, None ]
        regions[acronyms[row["state"]]].append(elt)
    regions = dict(regions)

    for cntry, data in regions.items():
        regions[cntry] = sorted_date(regions[cntry])

    for region, data in regions.items():
        write_tsv(f"{LOC}/{region}.tsv", cols, data, "unitedstates")

    # prepare dict for json
    regions2 = {}
    for region, data in regions.items():
        if not (region == "USA"):
            regions2["USA-"+region] = data
        else:
            regions2[region] = data

    regions3 = list_to_dict(regions2, cols)
    store_json(regions3)
