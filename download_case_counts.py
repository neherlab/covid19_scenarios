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
    return sorted(s, key=lambda d: datetime.strptime(d["time"], "%Y-%m-%d"))

def stoi(x):
    if x == "":
        return 0

    return int(x)

def getCaseCounts():
    cases = defaultdict(list)
    with urlopen(CASE_COUNT_URL) as res:
        buf = StringIO(res.read().decode(res.headers.get_content_charset()))
        crd = csv.reader(buf)

        Ix = {elt : i for i, elt in enumerate(next(crd))}
        for row in crd:
            country, date = row[Ix['location']], row[Ix['date']]
            cases[country].append({"time": date, "deaths": stoi(row[Ix['total_deaths']]), "cases":  stoi(row[Ix['total_cases']])})

        for cntry, data in cases.items():
            cases[cntry] = sorted_date(cases[cntry])

    return dict(cases)
# -----------------------------------------------------------------------------
# Main point of entry

if __name__ == "__main__":
    cases = getCaseCounts()

    json.dump(cases, sys.stdout)
