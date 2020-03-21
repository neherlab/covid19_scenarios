'''
parse country case counts provided by coronadatascraper.com and write results to TSV
this should be run from the top level of the repo.

Will need to be integrated with other parsers once they become available.
'''
import csv
import json
from urllib.request import urlopen

from collections import defaultdict
from datetime import datetime, timedelta
from .utils import write_tsv

# -----------------------------------------------------------------------------
# Globals

URL  = 'https://coronadatascraper.com/timeseries-byLocation.json'
LOC  = 'case-counts'
cols = ['location', 'time', 'cases', 'deaths', 'hospitalized', 'ICU', 'recovered']

# -----------------------------------------------------------------------------
# Functions

def sorted_date(s):
    return sorted(s, key=lambda d: datetime.strptime(d["time"], "%Y-%m-%d"))

def stoi(x):
    if x == "":
        return 0

    return int(x)

def parse_countries():
    # read the country_codes.csv for official country names
    country_names = {}
    file = "country_codes.csv"    
    countries = defaultdict(lambda: defaultdict(list))
    with open(file) as f:
        rdr = csv.reader(f)
        next(rdr)
        for row in rdr:
            countries[row[2]] = row[0]
    return countries

def retrieve_case_data():
    countries = parse_countries()
    
    cases = defaultdict(list)

    with urlopen(URL) as url:
        data = json.loads(url.read().decode())

    # example structure
    #  "THA": {
    #    "dates": {
    #      "2020-1-22": {
    #        "cases": 2,
    #        "deaths": 0,
    #        "recovered": 0,
    #        "active": 2
    
    for c in data:

        # replace country name if we have the "official" one in country_codes.csv
        if c in countries:
            country = countries[c]
        else:
            print('Error: %s not in country_code.csv, skipping'%c)
            continue
        for d in data[c]['dates']:
            vals = {'time': d, 'cases': '0', 'deaths': "0"}
            for k in ['deaths', 'cases', 'recovered']:
                if k in data[c]['dates'][d]:
                    vals[k] = str(data[c]['dates'][d][k])                
            cases[country].append(vals)

    for cntry, data in cases.items():
        cases[cntry] = sorted_date(cases[cntry])
        
    return dict(cases)


def flatten(cases):
    rows = []
    for cntry, data in cases.items():
        for datum in data:
            rows.append([cntry, datum['time'], datum['cases'], datum['deaths'], None, None, None])

    return rows

# -----------------------------------------------------------------------------
# Main point of entry

def parse():
    cases = retrieve_case_data()
    cases = flatten(cases)

    write_tsv(f"{LOC}/cds.tsv", cols, cases, "cds")

if __name__ == "__main__":
    # for debugging
    cases = retrieve_case_data()
    cases = flatten(cases)
