import sys
import csv
import json

from io import StringIO
from urllib.request import urlopen
from collections import defaultdict
from datetime import datetime

# -----------------------------------------------------------------------------
# Globals

CASE_COUNT_URL = "https://covid.ourworldindata.org/data/full_data.csv"

def sorted_date(s):
    return sorted(s, key=lambda d: datetime.strptime(d["t"], "%Y-%m-%d"))

def stoi(x):
    if x == "":
        return 0

    return int(x)

# -----------------------------------------------------------------------------
# Main point of entry

if __name__ == "__main__":
    cases = defaultdict(lambda: {"deaths": [], "cases": []})
    with urlopen(CASE_COUNT_URL) as res:
        buf = StringIO(res.read().decode(res.headers.get_content_charset()))
        crd = csv.reader(buf)

        Ix = {elt : i for i, elt in enumerate(next(crd))}
        for row in crd:
            country, date = row[Ix['location']], row[Ix['date']]
            cases[country]['deaths'].append({"t": date, "y": stoi(row[Ix['total_deaths']])})
            cases[country]['cases'].append({"t": date, "y": stoi(row[Ix['total_cases']])})

        for cntry, data in cases.items():
            cases[cntry]['cases']  = sorted_date(cases[cntry]['cases'])
            cases[cntry]['deaths'] = sorted_date(cases[cntry]['deaths'])

    json.dump(dict(cases), sys.stdout)
