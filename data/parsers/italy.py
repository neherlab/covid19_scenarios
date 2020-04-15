import sys
import json
import requests
import numpy as np

from collections import defaultdict
from .utils import store_data

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
    dates = defaultdict(lambda: np.zeros(len(cols)-1))
    for data in regions.values():
        for datum in data:
            dates[datum[0]] += np.array(datum[1:])

    regions["Italy"] = []
    for date, counts in dates.items():
        regions["Italy"].append([date] + [int(c) for c in counts])

    #https://github.com/neherlab/covid19_scenarios/issues/341
    regions["ITA-TrentionAltoAdige"] = []
    for empiricalData in regions['ITA-P.A. Bolzano']:
        nd = empiricalData.copy()
        regions["ITA-TrentionAltoAdige"].append(nd)
    for empiricalData in regions['ITA-P.A. Trento']:
        time = empiricalData[0]
        new = True
        for d in regions["ITA-TrentionAltoAdige"]:
            # Check if we had data for this date already, if yes add if needed/possible
            if d[0] == time:
                new = False
                for i in range(1,len(d)):
                    d[i] += empiricalData[i]
        if new:
            # we did not have that date in the aggregate yet
            regions["ITA-TrentionAltoAdige"].append(empiricalData)

    store_data(regions, 'italy', cols)
