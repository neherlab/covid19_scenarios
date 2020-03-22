import os, sys
import csv
import json
import requests
import numpy as np

from collections import defaultdict
from .utils import write_tsv, store_json, list_to_dict

# ------------------------------------------------------------------------
# Globals

# For my American brain
X = {
        "time" : "data",
        "state": "stato",
        "region": "denominazione_regione",
        "hospitalized" : "ricoverati_con_sintomi",
        "ICU" : "terapia_intensiva",
        "cases" : "totale_casi",
        "deaths" : "deceduti",
        "recovered": "dimessi_guariti",
        "swabs" : "tamponi",
}

URL  = "https://raw.github.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json"
LOC  = "case-counts/Europe/Southern Europe/Italy"
cols = ['time', 'cases', 'deaths', 'hospitalized', 'ICU', 'recovered']

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

    # Convert to ready made TSVs
    regions = defaultdict(list)
    for row in db:
        elt = [ int(row[X[c]]) if i > 0 else row[X[c]].split()[0] for i, c in enumerate(cols) ]
        regions[row[X["region"]]].append(elt)
    regions = dict(regions)

    # Sum all regions to obtain Italian data
    dates = defaultdict(lambda: np.zeros(len(cols)-1))
    for data in regions.values():
        for datum in data:
            dates[datum[0]] += np.array(datum[1:])

    regions["Italy"] = []
    for date, counts in dates.items():
        regions["Italy"].append([date] + [int(c) for c in counts])

    for region, data in regions.items():
        write_tsv(f"{LOC}/{region}.tsv", cols, data, "italy")

    # prepare dict for json
    regions2 = {}
    for region, data in regions.items():
        if not region == "Italy":
            regions2["ITA-"+region] = data
        else:
            regions2[region] = data
    regions3 = list_to_dict(regions2, cols)
    store_json(regions3)

