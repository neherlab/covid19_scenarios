import sys
import requests
import csv
import io

from collections import defaultdict
from .utils import store_data

# ------------------------------------------------------------------------
# Globals

cantonal_codes = {
   "ZH": "Zürich",
   "BE": "Bern",
   "LU": "Luzern",
   "UR": "Uri",
   "SZ": "Schwyz",
   "OW": "Obwalden",
   "NW": "Nidwalden",
   "GL": "Glarus",
   "ZG": "Zug",
   "FR": "Fribourg",
   "SO": "Solothurn",
   "BS": "Basel-Stadt",
   "BL": "Basel-Landschaft",
   "SH": "Schaffhausen",
   "AR": "Appenzell Ausserrhoden",
   "AI": "Appenzell Innerrhoden",
   "SG": "St. Gallen",
   "GR": "Graubünden",
   "AG": "Aargau",
   "TG": "Thurgau",
   "TI": "Ticino",
   "VD": "Vaud",
   "VS": "Valais",
   "NE": "Neuchâtel",
   "GE": "Geneva",
   "JU": "Jura",
   "FL": "Liechtenstein",
   "CH": "Switzerland",
}

URL  = "https://raw.github.com/openZH/covid_19/master/COVID19_Cases_Cantons_CH_total.csv"
URL_MASK  = "https://raw.githubusercontent.com/openZH/covid_19/master/fallzahlen_kanton_total_csv/COVID19_Fallzahlen_Kanton_CANTONCODE_total.csv"
URL_FL  = "https://raw.githubusercontent.com/openZH/covid_19/master/fallzahlen_kanton_total_csv/COVID19_Fallzahlen_FL_total.csv"
LOC  = "case-counts/Europe/Western Europe/Switzerland"
LOC2 = "case-counts/Europe/Western Europe/Liechtenstein"
cols = ['time', 'cases', 'deaths', 'hospitalized', 'ICU', 'recovered']

# ------------------------------------------------------------------------
# Functions

def to_int(x):
    if x == "NA" or x == "":
        return None
    else:
        return int(x)

# ------------------------------------------------------------------------
# Main point of entry

def parse_totals_file():
    r  = requests.get(URL)
    if not r.ok:
        print(f"Failed to fetch {URL}", file=sys.stderr)
        sys.exit(1)
        r.close()

    regions = defaultdict(list)
    fd  = io.StringIO(r.text)
    rdr = csv.reader(fd)
    hdr = next(rdr)

    for row in rdr:
        date   = row[0]
        canton = cantonal_codes[row[1]]
        regions[canton].append([date, to_int(row[2]), to_int(row[5]), to_int(row[6]), None, to_int(row[7])])

    store_data(regions, { 'default': LOC, 'Liechtenstein': LOC2, 'Switzerland': LOC}, 'switzerland','CHE', cols)


def parse():
    regions = defaultdict(list)
    for canton in cantonal_codes:
        if canton=='CH':
            continue
        if canton=="FL":
            r  = requests.get(URL_FL)
        else:
            r  = requests.get(URL_MASK.replace("CANTONCODE", canton))
        if not r.ok:
            print(f"Failed to fetch {URL}", file=sys.stderr)
            sys.exit(1)
            r.close()

        fd  = io.StringIO(r.text)
        rdr = csv.reader(fd)
        hdr = next(rdr)
        canton_data = []
        cases_idx = hdr.index('ncumul_conf')
        hospitalized_idx = hdr.index('ncumul_hosp')
        ICU_idx = hdr.index('ncumul_ICU')
        deaths_idx = hdr.index('ncumul_deceased')
        recovered_idx = hdr.index('ncumul_released')

        for row in rdr:
            date   = row[0]
            assert canton==row[2]
            cases = to_int(row[cases_idx])
            if cases is None and len(canton_data)>0:
                cases = canton_data[-1][1]

            canton_data.append([date, cases,
                                to_int(row[deaths_idx]),
                                to_int(row[hospitalized_idx]),
                                to_int(row[ICU_idx]),
                                to_int(row[recovered_idx])])

        regions[cantonal_codes[canton]] = canton_data

    store_data(regions, { 'default': LOC, 'Liechtenstein': LOC2, 'Switzerland': LOC}, 'switzerland','CHE', cols)
