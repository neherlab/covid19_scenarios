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
from .utils import write_tsv, flatten, parse_countries, stoi, merge_cases, sorted_date, store_json

# -----------------------------------------------------------------------------
# Globals

URL  = 'https://coronadatascraper.com/timeseries-byLocation.json'
cols = ['location', 'time', 'cases', 'deaths', 'hospitalized', 'ICU', 'recovered']

# -----------------------------------------------------------------------------
# Functions

def retrieve_case_data():
    countries = parse_countries(2)    
    cases = defaultdict(list)

    with urlopen(URL) as url:
        data = json.loads(url.read().decode())
    
    for c in data:
        # replace country name if we have the "official" one in country_codes.csv
        if c in countries:
            country = countries[c]
        else:
            try:
                # the order of county, region, county needs to be inverted
                split = [x.strip() for x in c.split(',')]
                if split[0] in countries:
                    split[0] = countries[split[0]]                
                country = "-".join(split[::-1])
            except:
                print("Error during country parsing "+c)
                continue
        
        for d in data[c]['dates']:
            vals = {'time': d, 'cases': None, 'deaths': None}
            for k in ['deaths', 'cases', 'recovered']:
                if k in data[c]['dates'][d]:
                    vals[k] = int(data[c]['dates'][d][k]) 
            cases[country].append(vals)

    for cntry, data in cases.items():
        cases[cntry] = sorted_date(cases[cntry])
        
    return dict(cases)

# -----------------------------------------------------------------------------
# Main point of entry

def parse():
    cases = retrieve_case_data()
    store_json(cases)
    
    # for legacy support
    cases = flatten(cases)
    write_tsv(f"case-counts/cds.tsv", cols, cases, "cds")

if __name__ == "__main__":
    # for debugging
    cases = retrieve_case_data()
    cases = flatten(cases)
