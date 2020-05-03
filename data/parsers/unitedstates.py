import sys
import json
import requests
import json

from collections import defaultdict
from datetime import datetime
from .utils import store_data, stoi

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

URL  = "https://covidtracking.com/api/v1/states/daily.json"
cols = ['time', 'cases', 'deaths', 'hospitalized', 'icu', 'recovered']

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
        elt  = [ date, stoi(row.get("positive", None)), stoi(row.get("death", None)),
                    stoi(row.get("hospitalizedCurrently", None)),
                    stoi(row.get("inIcuCurrently", None)), None]
        regions[acronyms[row["state"]]].append(elt)
    regions = dict(regions)

    regions2 = {}
    for cntry, data in regions.items():
        regions2['-'.join(['USA',cntry])] = sorted_date(regions[cntry])

    store_data(regions2, 'unitedstates', cols)
