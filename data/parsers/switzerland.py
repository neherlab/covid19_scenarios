import sys
import requests
import csv
import io

from collections import defaultdict
import numpy as np
from .utils import store_data, stoi

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

aggregates = {"Basel": ["Basel-Landschaft", "Basel-Stadt"],
              "NWS": ["Basel-Landschaft", "Basel-Stadt", "Aargau"]}

URL_MASK  = "https://raw.githubusercontent.com/openZH/covid_19/master/fallzahlen_kanton_total_csv/COVID19_Fallzahlen_Kanton_CANTONCODE_total.csv"
URL_FL  = "https://raw.githubusercontent.com/openZH/covid_19/master/fallzahlen_kanton_total_csv/COVID19_Fallzahlen_FL_total.csv"
cols = ['time', 'cases', 'deaths', 'hospitalized', 'icu', 'recovered']

def aggregate_regions(regions, cantons):
    data_by_date = defaultdict(list)

    for c in cantons:
        for d in regions[c]:
            data_by_date[d[0]].append([x if x else np.nan for x in d[1:]])

    new_data = [[date] + [None if np.isnan(x) else int(x) for x in np.sum(v, axis=0)]
                for date, v in sorted(data_by_date.items())]

    return new_data



# ------------------------------------------------------------------------
# Main point of entry

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
        icu_idx = hdr.index('ncumul_ICU')
        deaths_idx = hdr.index('ncumul_deceased')
        recovered_idx = hdr.index('ncumul_released')

        for row in rdr:
            date   = row[0]
            assert canton==row[2]
            cases = stoi(row[cases_idx])
            if cases is None and len(canton_data)>0:
                cases = canton_data[-1][1]

            canton_data.append([date, cases,
                                stoi(row[deaths_idx]),
                                stoi(row[hospitalized_idx]),
                                stoi(row[icu_idx]),
                                stoi(row[recovered_idx])])

        regions[cantonal_codes[canton]] = canton_data

    for name, cantons in aggregates.items():
        regions[name] = aggregate_regions(regions, cantons)

    regions2 = {}
    for region in regions.keys():
        if region == 'Switzerland' or region == 'Liechtenstein':
            regions2[region] = regions[region]
        else:
            regions2['-'.join(['CHE',region])] = regions[region]


    store_data(regions2, 'switzerland', cols)
