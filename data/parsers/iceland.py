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

URL_CASES_CUM = "https://raw.githubusercontent.com/tryggvigy/covid19_scenarios_is/master/data/cumulative_cases.cvs"
URL_DEATHS_CUM = "https://raw.githubusercontent.com/tryggvigy/covid19_scenarios_is/master/data/cumulative_deaths.cvs"
URL_HOSPITALIZED_CUM = "https://raw.githubusercontent.com/tryggvigy/covid19_scenarios_is/master/data/cumulative_hospitalized.cvs"
URL_ICU_CUM = "https://raw.githubusercontent.com/tryggvigy/covid19_scenarios_is/master/data/cumulative_icu.cvs"
URL_RECOVERED_CUM = "https://raw.githubusercontent.com/tryggvigy/covid19_scenarios_is/master/data/cumulative_recovered.cvs"

LOC = "case-counts/Europe/Northern Europe/Iceland"
cols = ['time', 'cases', 'deaths', 'hospitalized', 'icu', 'recovered']

# ------------------------------------------------------------------------
# Functions

def sorted_date(s):
    return sorted(s, key=lambda d: datetime.strptime(d[cols.index('time')], "%Y-%m-%d"))


# ------------------------------------------------------------------------
# Sub parsers


def parse_csv(regions_date, url, output_column):
    r = requests.get(url)
    if not r.ok:
        print(f"Failed to fetch {url}", file=sys.stderr)
        exit(1)
        r.close()

    fd = io.StringIO(r.text)
    rdr = csv.reader(fd)
    next(rdr)

    for row in rdr:
        date_string = row[0]
        if row[1] == '':
            regions_date["Iceland"][date_string][output_column] = None
        else:
            regions_date["Iceland"][date_string][output_column] = row[1]


def parse_cases(regions_date):
    parse_csv(regions_date, URL_CASES_CUM, 'cases')

def parse_deaths(regions_date):
    parse_csv(regions_date, URL_DEATHS_CUM, 'deaths')

def parse_hospitalized(regions_date):
    parse_csv(regions_date, URL_HOSPITALIZED_CUM, 'hospitalized')

def parse_icu(regions_date):
    parse_csv(regions_date, URL_ICU_CUM, 'icu')

def parse_recovered(regions_date):
    parse_csv(regions_date, URL_RECOVERED_CUM, 'recovered')

# ------------------------------------------------------------------------
# Main point of entry

def parse():
    regions_date = defaultdict(lambda: defaultdict(dict))

    parse_cases(regions_date)
    parse_deaths(regions_date)
    parse_hospitalized(regions_date)
    parse_icu(regions_date)
    parse_recovered(regions_date)

    regions = defaultdict(list)
    for region in regions_date:
        for date in regions_date[region]:
            entry = [
                date,
                regions_date[region][date].get('cases', None),
                regions_date[region][date].get('deaths', None),
                regions_date[region][date].get('hospitalized', None),
                regions_date[region][date].get('icu', None),
                regions_date[region][date].get('recovered', None),
            ]
            regions[region].append(entry)
    regions = dict(regions)

    store_data(regions, 'iceland', cols)
