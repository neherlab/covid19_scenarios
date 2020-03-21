'''
parse country case counts provided by ECDC and write results to TSV
this should be run from the top level of the repo.

Will need to be integrated with other parsers once they become available.
'''
import xlrd
from urllib.request import urlretrieve

from collections import defaultdict
from datetime import datetime, timedelta
from .utils import write_tsv

# -----------------------------------------------------------------------------
# Globals

URL  = "https://www.ecdc.europa.eu/sites/default/files/documents/COVID-19-geographic-disbtribution-worldwide-"
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

def retrieve_case_data():
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
        country, date = row[Ix['Countries and territories']].replace("_"," "), "-".join([str(int(row[Ix['Year']])), str(int(row[Ix['Month']])), str(int(row[Ix['Day']]))])
        # note: Cases are per day, not cumulative. We need to aggregate later
        cases[country].append({"time": date, "deaths": stoi(row[Ix['Deaths']]), "cases":  stoi(row[Ix['Cases']])})

    for cntry, data in cases.items():
        cases[cntry] = sorted_date(cases[cntry])

    # aggregate cases here after sorting
    for cntry, data in cases.items():
        total = 0
        for d in data:
            total += d['cases']
            d['cases'] = total
        cases[cntry] = data
        
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

    write_tsv(f"{LOC}/ecdcWorld.tsv", cols, cases, "world")

if __name__ == "__main__":
    # for debugging
    cases = retrieve_case_data()
    cases = flatten(cases)
