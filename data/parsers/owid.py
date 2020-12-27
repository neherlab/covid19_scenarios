'''
parse country case counts provided by ECDC
'''
import json
import csv

from urllib.request import urlretrieve
from collections import defaultdict
from datetime import datetime, timedelta
from .utils import sorted_date, parse_countries, stoi, store_data

# -----------------------------------------------------------------------------
# Globals

URL = "https://covid.ourworldindata.org/data/owid-covid-data.json"

# -----------------------------------------------------------------------------
# Functions

def retrieve_case_data():
    countries = parse_countries(2)
    cases = defaultdict(list)

    try:
        file_name, headers = urlretrieve(URL)
    except:
        print(f'attempting to write to {file_name}')
        raise(f'Can not retrieve from {URL}')


    with open(file_name, 'r') as fh:
        data = json.load(fh)

    for country_code in data:
        if country_code not in countries:
            continue

        country = countries[country_code]
        for record in data[country_code]["data"]:
            # note: Cases are per day, not cumulative. We need to aggregate later
            cases[country].append({"time": record['date'],
                                   "deaths": int(record['total_deaths']) if 'total_deaths' in record else 0,
                                   "cases":  int(record['total_cases']) if 'total_cases' in record else 0})

    for cntry, data in cases.items():
        cases[cntry] = sorted_date(cases[cntry])

    return dict(cases)

# -----------------------------------------------------------------------------
# Main point of entry

def parse():
    cases = retrieve_case_data()
    store_data(cases, 'owid')

