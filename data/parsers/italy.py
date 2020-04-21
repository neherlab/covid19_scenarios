import sys
import json
import requests
import numpy as np

from collections import defaultdict
from .utils import store_data, add_cases

# ------------------------------------------------------------------------
# Globals

# For my American brain
X = {
        "time" : "data",
        "state": "stato",
        "region": "denominazione_regione",
        "hospitalized" : "ricoverati_con_sintomi",
        "icu" : "terapia_intensiva",
        "cases" : "totale_casi",
        "deaths" : "deceduti",
        "recovered": "dimessi_guariti",
        "swabs" : "tamponi",
}

URL  = "https://raw.github.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json"
cols = ['time', 'cases', 'deaths', 'hospitalized', 'icu', 'recovered']

# ------------------------------------------------------------------------
# Main point of entry

def parse():
    r  = requests.get(URL)
    if not r.ok:
        print(f"Failed to fetch {URL}", file=sys.stderr)
        exit(1)
        r.close()

    db = json.loads(r.text)
    r.close()

    # Convert to our datatype
    regions = defaultdict(list)
    for row in db:
        elt = [ int(row[X[c]]) if i > 0 else row[X[c]][:10] for i, c in enumerate(cols) ]
        regions['-'.join(['ITA',row[X["region"]]])].append(elt)
    regions = dict(regions)

    # Sum all regions to obtain Italian data
    regions = add_cases(regions, list(regions.keys()), 'Italy', cols)

    #https://github.com/neherlab/covid19_scenarios/issues/341
    regions = add_cases(regions, ['ITA-P.A. Bolzano', 'ITA-P.A. Trento'], 'ITA-TrentinoAltoAdige', cols)

    store_data(regions, 'italy', cols)
