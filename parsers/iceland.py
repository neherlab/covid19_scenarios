import sys
import requests
import json
import csv
import io

from collections import defaultdict
from datetime import datetime, timedelta
from .utils import store_data

# ------------------------------------------------------------------------
# Globals

URL_CASES_CUM = "https://raw.githubusercontent.com/tryggvigy/CoronaWatchIS/master/data/covid_in_is.cvs"
URL_HOSPITALIZED_CUM = "https://raw.githubusercontent.com/tryggvigy/CoronaWatchIS/master/data/covid_in_is_hosp.cvs"

LOC = "case-counts/Europe/Northern Europe/Iceland"
cols = ['time', 'cases', 'deaths', 'hospitalized', 'ICU', 'recovered']

# ------------------------------------------------------------------------
# Functions

def parse_date(s):
    try:
      # URL_CASES_CUM date formats are 03-26-2020. Convert them to 2020-03-26
      return datetime.strftime(datetime.strptime(s,'%m-%d-%Y'),'%Y-%m-%d')
    except ValueError:
        # If the conversion fails, then assume s is a date in URL_HOSPITALIZED_CUM
        # and already of the expected format 2020-03-26
        return s

def sorted_date(s):
    return sorted(s, key=lambda d: datetime.strptime(d[cols.index('time')], "%Y-%m-%d"))


# ------------------------------------------------------------------------
# Sub parsers


def parse_csv(regions_date, url, col_index, output_column):
    r = requests.get(url)
    if not r.ok:
        print(f"Failed to fetch {url}", file=sys.stderr)
        exit(1)
        r.close()

    fd = io.StringIO(r.text)
    rdr = csv.reader(fd)
    next(rdr)

    for row in rdr:
        date_string = parse_date(row[0])
        regions_date["Iceland"][date_string][output_column] = row[col_index]


def parse_cases(regions_date):
    parse_csv(regions_date, URL_CASES_CUM, 4, 'cases')

def parse_deaths(regions_date):
    parse_csv(regions_date, URL_CASES_CUM, 7, 'deaths')

def parse_hospitalized(regions_date):
    parse_csv(regions_date, URL_HOSPITALIZED_CUM, 4, 'hospitalized')

def parse_icu(regions_date):
    parse_csv(regions_date, URL_HOSPITALIZED_CUM, 2, 'ICU')

# ------------------------------------------------------------------------
# Main point of entry

def parse():
    regions_date = defaultdict(lambda: defaultdict(dict))

    parse_cases(regions_date)
    parse_deaths(regions_date)
    parse_hospitalized(regions_date)
    parse_icu(regions_date)

    regions = defaultdict(list)
    for region in regions_date:
        for date in regions_date[region]:
            entry = [
                date,
                regions_date[region][date].get('cases', None),
                regions_date[region][date].get('deaths', None),
                regions_date[region][date].get('hospitalized', None),
                regions_date[region][date].get('ICU', None),
                None
            ]
            regions[region].append(entry)
    regions = dict(regions)

    for region in regions.keys():
        regions[region] = sorted_date(regions[region])

    store_data(regions, {'default': LOC}, 'iceland', 'ISL', cols)
