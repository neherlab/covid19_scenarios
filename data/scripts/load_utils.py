import json, importlib, csv, os
from datetime import datetime
import numpy as np
from paths import BASE_PATH

PATH_UN_AGES   = os.path.join(BASE_PATH, "../src/assets/data/ageDistribution.json")
PATH_UN_CODES  = os.path.join(BASE_PATH,"country_codes.csv")
PATH_POP_DATA  = os.path.join(BASE_PATH,"populationData.tsv")


# ------------------------------------------
# Data loading
def convert_to_vectors(ts):
    data = {}
    fields = ['cases', 'hospitalized', 'deaths', 'icu', 'time']
    for k in fields:
        data[k] = []

    for tp in ts: #replace all zeros by np.nan
        for k in fields:
            if k=='time':
                data[k].append(datetime.strptime(tp['time'].split('T')[0], "%Y-%m-%d").toordinal())
            else:
                data[k].append(tp[k] or np.nan)

    data = {k:np.ma.array(v) for k,v in data.items()}

    for k,v in data.items():
        data[k].mask = np.isnan(data[k])
        if False not in data[k].mask:
            data[k] = None

    return data


def cumulative_to_rolling_average(data, smoothing=7):
    smoothed_data = {'time': data['time'][smoothing:]}
    for k in ['cases', 'deaths']:
        if k in data:
            if data[k] is not None:
                smoothed_data[k] = data[k][smoothing:] - data[k][:-smoothing]
                smoothed_data[k][smoothed_data[k].mask] = 0
            else:
                smoothed_data[k] = None

    return smoothed_data


def get_case_data():
    CASES = importlib.import_module(f"scripts.tsv")
    return CASES.parse()

def load_distribution():
    dist = {}
    with open(PATH_UN_AGES, 'r') as fd:
        db = json.load(fd)
        for data in db["all"]:
            key    = data["name"]
            ageDis = sorted(data["data"], key=lambda x: x["ageGroup"])
            dist[key] = np.array([float(elt["population"]) for elt in ageDis])
            dist[key] = dist[key]/np.sum(dist[key])

    return dist

def load_country_codes():
    db = {}
    with open(PATH_UN_CODES, 'r') as fd:
        rdr = csv.reader(fd)
        next(rdr)
        for entry in rdr:
            db[entry[0]] = entry[2]

    return db

def load_population_data():
    SCENARIO_POPS = os.path.join(BASE_PATH, "populationData.tsv")
    scenarios = {}
    with open(SCENARIO_POPS, 'r') as fd:
        rdr = csv.reader(fd, delimiter='\t')
        hdr = next(rdr)
        idx = {'name' : hdr.index('name'),
               'size' : hdr.index('populationServed'),
               'r0' : hdr.index('r0'),
               'ages' : hdr.index('ageDistribution'),
               'beds' : hdr.index('hospitalBeds'),
               'icus' : hdr.index('ICUBeds'),
               'hemisphere' : hdr.index('hemisphere'),
               'srcPopulation' : hdr.index('srcPopulation'),
               'srcHospitalBeds' : hdr.index('srcHospitalBeds'),
               'srcICUBeds' : hdr.index('srcICUBeds')}

        for region in rdr:
            region_name = region[idx['name']]
            tmp = {}
            for k,v in idx.items():
                try:
                    tmp[k] = float(region[v])
                except:
                    tmp[k] = region[v]
            scenarios[region_name] = tmp
    return scenarios

def write_population_data(data):
    SCENARIO_POPS = os.path.join(BASE_PATH, "populationData.tsv")
    cols = {'name': 'name',
            'size': 'populationServed',
            'r0': 'r0',
            'ages': 'ageDistribution',
            'beds': 'hospitalBeds',
            'icus': 'ICUBeds',
            'hemisphere': 'hemisphere',
            'srcPopulation': 'srcPopulation',
            'srcHospitalBeds': 'srcHospitalBeds',
            'srcICUBeds': 'srcICUBeds',
    }

    with open(SCENARIO_POPS, 'w') as fd:
        fd.write('\t'.join(cols.values()) + '\n')
        for datum in data.values():
            fd.write('\t'.join([str(datum[c]) for c in cols]) + '\n')
