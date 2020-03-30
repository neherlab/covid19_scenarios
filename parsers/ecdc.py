'''
parse country case counts provided by ECDC and write results to TSV
this should be run from the top level of the repo.

Will need to be integrated with other parsers once they become available.
'''
import xlrd
import csv
import json

from urllib.request import urlretrieve
from collections import defaultdict
from datetime import datetime, timedelta
from .utils import sorted_date, parse_countries, stoi, store_data

# -----------------------------------------------------------------------------
# Globals

URL  = "https://www.ecdc.europa.eu/sites/default/files/documents/COVID-19-geographic-disbtribution-worldwide-"
LOC  = 'case-counts'
cols = ['location', 'time', 'cases', 'deaths', 'hospitalized', 'ICU', 'recovered']

# -----------------------------------------------------------------------------
# Functions

def retrieve_case_data():
    countries = parse_countries(1)

    cases = defaultdict(list)

    # For now, always get the data from yesterday. We could make fancier check if today's data is already available
    yesterday = datetime.today() - timedelta(days=1)
    date = yesterday.strftime("%Y-%m-%d")

    file_name, headers = urlretrieve(URL+date+".xlsx")
    workbook = xlrd.open_workbook(file_name)

    #worksheet = workbook.sheet_by_name('COVID-19-geographic-disbtributi')
    worksheet = workbook.sheet_by_index(0) # likely more stable

    i = 0
    Ix = {}
    for c in worksheet.row_values(0):
        Ix[c] = i
        i += 1
    for row_index in range(1, worksheet.nrows):
        row = worksheet.row_values(row_index)

        country = row[Ix['countriesAndTerritories']].replace("_"," ")

        # replace country name if we have the "official" one in country_codes.csv
        geoID = row[Ix['geoId']]
        if geoID in countries:
            country = countries[geoID]

        date = f"{int(row[Ix['year']]):04d}-{int(row[Ix['month']]):02d}-{int(row[Ix['day']]):02d}"

        # note: Cases are per day, not cumulative. We need to aggregate later
        cases[country].append({"time": date, "deaths": stoi(row[Ix['deaths']]), "cases":  stoi(row[Ix['cases']])})

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

