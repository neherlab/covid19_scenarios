import csv
import sys, os
sys.path.append('..')
from collections import defaultdict
from paths import MITIGATION_TABLE, BASE_PATH

##
mitigationMeasures = {
"Ban on mass gatherings":{"color": "#7fc97f", "value": 0.1},
"Nurseries/schools/universities closure": {"color": "#beaed4", "value":0.1},
"Restaurants/entertainment/shops closure": {"color": "#fdc086", "value":0.1},
"Soft population lockdown": {"color": "#ffff99", "value":0.1},
"Hard population lockdown": {"color": "#386cb0", "value":0.1},
"Contact Tracing": {"color": "#f0027f", "value":0.1},
"Intervention #1": {"color": "#bf5b17", "value":0.1},
"Intervention #2": {"color": "#666666", "value":0.1},
}

def read_table():
    measures = defaultdict(list)
    with open(os.path.join(BASE_PATH, MITIGATION_TABLE), 'r') as fh:
        rdr = csv.reader(fh, delimiter='\t')
        header = rdr.__next__()
        tMin_idx = header.index("Start date")
        tMax_idx = header.index("End date")
        key_idx = header.index("Country/State")
        measure_idx = header.index("Mitigation measure")

        for row in rdr:
            if row[measure_idx] not in mitigationMeasures:
                print("unknown mitigation measure, skipping")
                continue
            tmp = {}
            tmp["tMin"] = row[tMin_idx]
            tmp["tMax"] = row[tMax_idx]
            tmp["name"] = row[measure_idx]
            measures[row[key_idx]].append(tmp)

    return measures





