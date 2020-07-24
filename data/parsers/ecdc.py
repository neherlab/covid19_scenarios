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

# URL  = "https://www.ecdc.europa.eu/sites/default/files/documents/COVID-19-geographic-disbtribution-worldwide-"
URL = "https://opendata.ecdc.europa.eu/covid19/casedistribution/json"

# -----------------------------------------------------------------------------
# Functions

def retrieve_case_data():
    countries = parse_countries(1)
    countries['UK'] = countries['GB'] # fixing error in data source
    countries['EL'] = countries['GR'] # fixing error in data source

    cases = defaultdict(list)

    # For now, always get the data from yesterday. We could make fancier check if today's data is already available
    try:
        file_name, headers = urlretrieve(URL)
    except:
        print(f'attempting to write to {file_name}')
        raise(f'Can not retrieve from {URL}')


    with open(file_name, 'r') as fh:
        data = json.load(fh)

    for row in data['records']:
        country = row['countriesAndTerritories'].replace("_"," ")

        # replace country name if we have the "official" one in country_codes.csv
        geoID = row['geoId']
        if geoID in countries:
            country = countries[geoID]

        date = f"{int(row['year']):04d}-{int(row['month']):02d}-{int(row['day']):02d}"

        # note: Cases are per day, not cumulative. We need to aggregate later
        cases[country].append({"time": date, "deaths": stoi(row['deaths']), "cases":  stoi(row['cases'])})

    for cntry, data in cases.items():
        cases[cntry] = sorted_date(cases[cntry])

    # aggregate cases/deaths here after sorting
    for cntry, data in cases.items():
        total = {}
        total['cases']  = 0
        total['deaths'] = 0
        for k in total:
            for d in data:
                if k in d and d[k]:
                    total[k] += d[k]
                d[k] = total[k]

    return dict(cases)

# -----------------------------------------------------------------------------
# Main point of entry

def parse():
    cases = retrieve_case_data()
    store_data(cases, 'ecdc')

