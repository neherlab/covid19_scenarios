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

URL_CASES_CUM = "https://raw.githubusercontent.com/J535D165/CoronaWatchNL/master/data/rivm_corona_in_nl_daily.csv"
URL_DEATHS_CUM = "https://raw.githubusercontent.com/J535D165/CoronaWatchNL/master/data/rivm_corona_in_nl_fatalities.csv"
URL_HOSPITALIZED_CUM = "https://raw.githubusercontent.com/J535D165/CoronaWatchNL/master/data/rivm_corona_in_nl_hosp.csv"
URL_ICU_CUM = "https://www.stichting-nice.nl/covid-19/public/intake-count"
cols = ['time', 'cases', 'deaths', 'hospitalized', 'icu', 'recovered']

# ------------------------------------------------------------------------
# Functions


def sorted_date(s):
    return sorted(s, key=lambda d: datetime.strptime(d[cols.index('time')], "%Y-%m-%d"))


# ------------------------------------------------------------------------
# Sub parsers


def parse_csv(regions_date, url, column):
    r = requests.get(url)
    if not r.ok:
        print(f"Failed to fetch {url}", file=sys.stderr)
        r.close()

    fd = io.StringIO(r.text)
    rdr = csv.reader(fd)
    next(rdr)

    for row in rdr:
        date_string = row[0]
        regions_date["Netherlands"][date_string][column] = row[1]


def parse_cases(regions_date):
    parse_csv(regions_date, URL_CASES_CUM, 'cases')


def parse_deaths(regions_date):
    parse_csv(regions_date, URL_DEATHS_CUM, 'deaths')


def parse_hospitalized(regions_date):
    parse_csv(regions_date, URL_HOSPITALIZED_CUM, 'hospitalized')


def parse_icu(regions_date):
    r = requests.get(URL_ICU_CUM)
    if not r.ok:
        print(f"Failed to fetch {URL}", file=sys.stderr)
        r.close()

    db = json.loads(r.text)
    r.close()

    today = datetime.today()
    day_before_yesterday = today - timedelta(days=2)
    for row in db:
        date = datetime.strptime(row["date"], '%Y-%m-%d')
        # Data from last 2 days may be incomplete, so we ignore it
        if date < day_before_yesterday:
            date_string = str(row["date"])
            regions_date["Netherlands"][date_string]['icu'] = row["value"]


# ------------------------------------------------------------------------
# Main point of entry

def parse():
    regions_date = defaultdict(lambda: defaultdict(dict))

    parse_cases(regions_date)
    parse_deaths(regions_date)
    parse_hospitalized(regions_date)
    #parse_icu(regions_date)

    regions = defaultdict(list)
    for region in regions_date:
        for date in regions_date[region]:
            entry = [
                date,
                regions_date[region][date].get('cases', None),
                regions_date[region][date].get('deaths', None),
                regions_date[region][date].get('hospitalized', None),
                regions_date[region][date].get('icu', None),
                None
            ]
            regions[region].append(entry)
    regions = dict(regions)

    regions2 = {}
    for region in regions.keys():
        if not region =='Netherlands':
            regions2['-'.join(['NLD',region])] = sorted_date(regions[region])
        else:
            regions2[region] = sorted_date(regions[region])


    store_data(regions2, 'netherlands', cols)
