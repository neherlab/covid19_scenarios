import sys
import requests
import json

from collections import defaultdict
from datetime import datetime, timedelta
from .utils import store_data

# ------------------------------------------------------------------------
# Globals

URL_ICU_CUM = "https://www.stichting-nice.nl/covid-19/public/intake-cumulative"
LOC = "case-counts/Europe/Western Europe/Netherlands"
cols = ['time', 'ICU']

# ------------------------------------------------------------------------
# Functions


# ------------------------------------------------------------------------
# Main point of entry

def parse():
    r  = requests.get(URL_ICU_CUM)
    if not r.ok:
        print(f"Failed to fetch {URL}", file=sys.stderr)
        exit(1)
        r.close()

    db = json.loads(r.text)
    r.close()

    # Convert to ready made TSVs
    regions = defaultdict(list)
    today = datetime.today()
    day_before_yesterday = today - timedelta(days=2)
    for row in db:
        date = datetime.strptime(row["date"], '%Y-%m-%d')
        # Data from last 2 days may be incomplete, so we ignore it
        if date < day_before_yesterday:
            date_string = str(row["date"])
            elt = [date_string, row["intakeCumulative"]]
            regions["Netherlands"].append(elt)
    regions = dict(regions)

    store_data(regions, {'default': LOC, 'Netherlands': LOC}, 'netherlands', 'NLD', cols)
