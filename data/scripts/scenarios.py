import sys
import csv
import os
import json
import numpy as np
import multiprocessing as multi
import yaml

from uuid import uuid4
sys.path.append('..')

from datetime import datetime
from scipy.stats import linregress
from paths import TMP_CASES, BASE_PATH, JSON_DIR, FIT_PARAMETERS, SCHEMA_SCENARIOS
from scripts.tsv import parse as parse_tsv
from scripts.model import fit_population
from jsonschema import validate, FormatChecker

##
mitigation_colors = {
"School Closures": "#7fc97f",
"Social Distancing": "#beaed4",
"Lock-down": "#fdc086",
"Shut-down": "#ffff99",
"Case Isolation": "#386cb0",
"Contact Tracing": "#f0027f",
"Intervention #1": "#bf5b17",
"Intervention #2": "#666666",
}


# ------------------------------------------------------------------------
# Globals

SCENARIO_POPS = os.path.join(BASE_PATH, "populationData.tsv")
FIT_CASE_DATA = {}

# ------------------------------------------------------------------------
# Data fitter

ms_in_day = 1000*60*60*24

class Fitter:
    doubling_time   = 3.0
    serial_interval = 6.0
    fixed_slope     = np.log(2)/doubling_time
    cases_on_tMin   = 10
    under_reporting = 5
    delay           = 15
    fatality_rate   = 0.01

    def slope_to_r0(self, slope):
        return 1 + slope*self.serial_interval

    def fit(self, pop):
        # ----------------------------------
        # Internal functions

        def fit_cumulative(t, y):
            good_ind    = (y > 3) & (y < 500)
            t_subset    = t[good_ind]
            logy_subset = np.log(y[good_ind])
            num_data    = good_ind.sum()

            if num_data > 10:
                res = linregress(t_subset, logy_subset)
                return {"intercept" : res.intercept,
                        "slope"     : res.slope,
                        'rvalue'    : res.rvalue}
            elif num_data > 4:
                intercept = logy_subset.mean() - t_subset.mean()*self.fixed_slope
                return {"intercept" : intercept,
                        "slope"     : 1.0*self.fixed_slope,
                        'rvalue'    : np.nan}
            else:
                return None

        def to_ms(time):
            return datetime.strptime(time[:10], "%Y-%m-%d").toordinal()

        def from_ms(time):
            d = datetime.fromordinal(int(time))
            return f"{d.year:04d}-{d.month:02d}-{d.day:02d}"

        # ----------------------------------
        # Body

        data = np.array([ ([to_ms(dp['time']), dp['cases'] or np.nan, dp['deaths'] or np.nan]) for dp in pop ])

        # Try to fit on death
        p = fit_cumulative(data[:,0], data[:,2])
        if p and p["slope"] > 0:
            tMin = (np.log(self.cases_on_tMin * self.fatality_rate) - p["intercept"]) / p["slope"] - self.delay
            return {'tMin': from_ms(tMin), 'initialCases': self.cases_on_tMin, 'r0':self.slope_to_r0(p["slope"])}
        else: # If no death, fit on case counts
            p = fit_cumulative(data[:,0], data[:,1])
            if p and p["slope"] > 0:
                tMin = (np.log(self.cases_on_tMin)/self.under_reporting - p["intercept"]) / p["slope"]
                return {'tMin': from_ms(tMin), 'initialCases': self.cases_on_tMin, 'r0':self.slope_to_r0(p["slope"])}

        return None

# ------------------------------------------------------------------------
# Parameter classes
#
# IMPORTANT: Keep in sync with algorithm parameters of input [AllParamsFlat]
#            covid19_scenarios/src/algorithm/types/Param.types.ts

class Object:
    def marshalJSON(self):
        return json.dumps(self, default=lambda x: x.__dict__, sort_keys=True, indent=4)

class Measure(Object):
    def __init__(self, name='Intervention', tMin=None, tMax=None, id='', color='#cccccc', mitigationValue=0):
        self.name = name
        self.id = str(id)
        self.color = str(color)
        self.timeRange = DateRange(tMin, tMax)
        self.mitigationValue = mitigationValue

class PopulationParams(Object):
    def __init__(self, region, country, population, beds, icus):
        self.populationServed    = int(population)
        self.country             = country
        self.suspectedCasesToday = round(FIT_CASE_DATA[region]['initialCases'] if region in FIT_CASE_DATA else Fitter.cases_on_tMin)
        self.importsPerDay       = 0.1
        self.hospitalBeds        = int(beds)
        self.ICUBeds             = int(icus)
        self.cases               = region

class EpidemiologicalParams(Object):
    def __init__(self, region, hemisphere):
        self.latencyTime     = 3
        self.infectiousPeriod   = 3
        self.lengthHospitalStay = 4
        self.lengthICUStay      = 14
        if hemisphere:
            if hemisphere == 'Northern':
                self.seasonalForcing    = 0.0
                self.peakMonth          = 0
            elif hemisphere == 'Southern':
                self.seasonalForcing    = 0.0
                self.peakMonth          = 6
            elif hemisphere == 'Tropical':
                self.seasonalForcing    = 0
                self.peakMonth          = 6
            else:
                print(f'Error: Could not parse hemisphere for {region} in scenarios.py')
        else:
            self.seasonalForcing    = 0.0
            self.peakMonth          = 0
        self.overflowSeverity   = 2
        if region in FIT_CASE_DATA:
            self.r0 = max(1,round(FIT_CASE_DATA[region]['r0'],1))
        else:
            self.r0 = 2.7

class ContainmentParams(Object):
    def __init__(self):
        self.mitigationIntervals = []


class DateRange(Object):
    def __init__(self, tMin, tMax):
        self.tMin = tMin
        self.tMax = tMax

class SimulationParams(Object):
    def __init__(self, region):
        tMin = FIT_CASE_DATA[region]['tMin'] if region in FIT_CASE_DATA else "2020-03-01"
        tMax = "2020-09-01"
        self.simulationTimeRange  = DateRange(tMin, tMax)
        self.numberStochasticRuns = 0

# TODO: Region and country provide redudant information
#       Condense the information into one field.
class AllParams(Object):
    def __init__(self, region, country, population, beds, icus, hemisphere, srcPopulation, srcHospitalBeds, srcICUBeds):
        self.population      = PopulationParams(region, country, population, beds, icus)
        self.epidemiological = EpidemiologicalParams(region, hemisphere)
        self.simulation      = SimulationParams(region)
        self.containment     = ContainmentParams()
        # uncomment if the sources are needed in the app
        #self.sources         = {'populationServed': srcPopulation, 'hospitalBeds': srcHospitalBeds, 'ICUBeds': srcICUBeds }

# ------------------------------------------------------------------------
# Functions

def marshalJSON(obj, wtr):
    """ Validate and store data to .json file
    Arguments:
    - obj: a dict of allParams
    """
    newdata = []
    for k in obj:
        newdata.append({'country': k, 'allParams': obj[k]})

    # Serialize into json
    news = json.dumps(newdata, default=lambda x: x.__dict__, sort_keys=True, indent=4)

    # Validate the dict based on the json
    with open(os.path.join(BASE_PATH, SCHEMA_SCENARIOS), "r") as f:
        schema = yaml.load(f, Loader=yaml.FullLoader)
        validate(json.loads(news), schema, format_checker=FormatChecker())

    return wtr.write(news)

def fit_one_case_data(args):
    Params = Fitter()
    region, data = args

    r = fit_population(region)
    if r is None:
        return (region, Params.fit(data))
    else:
        if 'New York' in region:
            print(f"Region {region}: {r['params']}", file=sys.stderr)

    param = {"tMin": r['tMin'], "r0": np.exp(r['params'].rates.logR0), "initialCases": r["initialCases"]}
    return (region, param)

def fit_all_case_data(num_procs=4):
    pool = multi.Pool(num_procs)
    case_counts = parse_tsv()
    results = pool.map(fit_one_case_data, list(case_counts.items()))
    for k, v in results:
        if v is not None:
            FIT_CASE_DATA[k] = v


def set_mitigation(cases, scenario):
    valid_cases = [c for c in cases if c['cases'] is not None]
    if len(valid_cases)==0:
        scenario.containment.mitigationIntervals = []
        return

    case_counts = np.array([c['cases'] for c in valid_cases])
    levelOne = np.where(case_counts > min(max(5, 3e-4*scenario.population.populationServed),10000))[0]
    levelTwo = np.where(case_counts > min(max(50, 3e-3*scenario.population.populationServed),50000))[0]
    levelOneVal = round(1 - np.minimum(0.8, 1.8/scenario.epidemiological.r0), 1)
    levelTwoVal = round(1 - np.minimum(0.4, 0.5), 1)

    for name, level, val in [("Intervention #1", levelOne, levelOneVal), ('Intervention #2', levelTwo, levelTwoVal)]:
        if len(level):
            level_idx = level[0]
            cutoff_str = valid_cases[level_idx]["time"][:10]
            cutoff = datetime.strptime(cutoff_str, '%Y-%m-%d').toordinal()

            scenario.containment.mitigationIntervals.append(Measure(
                name=name,
                tMin=cutoff_str,
                id=uuid4(),
                tMax=scenario.simulation.simulationTimeRange.tMax[:10],
                color=mitigation_colors.get(name, "#cccccc"),
                mitigationValue=val))


# ------------------------------------------------------------------------
# Main point of entry

def generate(output_json, num_procs=1, recalculate=False):
    scenario = {}
    fit_fname = os.path.join(BASE_PATH,FIT_PARAMETERS)
    if recalculate or (not os.path.isfile(fit_fname)):
        fit_all_case_data(num_procs)
        with open(fit_fname, 'w') as fh:
            json.dump(FIT_CASE_DATA, fh)
    else:
        with open(fit_fname, 'r') as fh:
            tmp = json.load(fh)
            for k,v in tmp.items():
                FIT_CASE_DATA[k] = v

    case_counts = parse_tsv()

    with open(SCENARIO_POPS, 'r') as fd:
        rdr = csv.reader(fd, delimiter='\t')
        hdr = next(rdr)
        idx = {'name' : hdr.index('name'),
               'size' : hdr.index('populationServed'),
               'ages' : hdr.index('ageDistribution'),
               'beds' : hdr.index('hospitalBeds'),
               'icus' : hdr.index('ICUBeds'),
               'hemisphere' : hdr.index('hemisphere'),
               'srcPopulation' : hdr.index('srcPopulation'),
               'srcHospitalBeds' : hdr.index('srcHospitalBeds'),
               'srcICUBeds' : hdr.index('srcICUBeds')}

        args = ['name', 'ages', 'size', 'beds', 'icus', 'hemisphere', 'srcPopulation', 'srcHospitalBeds', 'srcICUBeds']
        for region in rdr:
            region_name = region[idx['name']]
            entry = [region[idx[arg]] for arg in args]
            scenario[region_name] = AllParams(*entry)
            if region_name in case_counts:
                set_mitigation(case_counts[region_name], scenario[region_name])
            else:
                scenario[region_name].containment.mitigationIntervals = []

    with open(output_json, "w+") as fd:
        marshalJSON(scenario, fd)

if __name__ == '__main__':
    generate()

