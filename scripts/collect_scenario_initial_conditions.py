import csv
import json
import numpy as np
from datetime import datetime
from scipy.stats import linregress

# ------------------------------------------------------------------------
# Globals

SCENARIO_POPS = "static_scenario_data.tsv"
OUTPUT_JSON   = "scenario_defaults.json"
FIT_CASE_DATA = {}

# ------------------------------------------------------------------------
# Data fitter

class Fitter:
    doubling_time   = 3.0
    serial_interval = 7.5
    fixed_slope     = np.log(2)/doubling_time
    cases_on_tMin   = 10
    under_reporting = 5
    delay           = 18
    fatality_rate   = 0.02

    def slope_to_r0(self,slope):
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
            return datetime.strptime(time, "%Y-%m-%d").toordinal()

        def from_ms(time):
            d = datetime.fromordinal(time)
            return f"{d.year:04d}-{d.month:02d}-{d.day:02d}"

        # ----------------------------------
        # Body

        data = np.array([ ([to_ms(dp['time']), dp['cases'] or np.nan, dp['deaths'] or np.nan]) for dp in pop ])

        # fit on death
        p = fit_cumulative(data[:,0], data[:,2])
        if p:
            tMin = (np.log(self.cases_on_tMin * self.fatality_rate) - p["intercept"]) / p["slope"] - self.delay
            return {'tMin': tMin, 'initialCases': self.cases_on_tMin, 'r0':self.slope_to_r0(p["slope"])}
        else: # fit on case counts
            p = fit_cumulative(data[:,0], data[:,1])
            if p:
                tMin = (np.log(self.cases_on_tMin)/self.under_reporting - p["intercept"]) / p["slope"]
                return {'tMin': tMin, 'initialCases': self.cases_on_tMin, 'r0':self.slope_to_r0(p["slope"])}

        return None

# ------------------------------------------------------------------------
# Parameter classes
#
# IMPORTANT: Keep in sync with algorithm parameters of input [AllParamsFlat]
#            covid19_scenarios/src/algorithm/types/Param.types.ts

class Object:
    def marshalJSON(self):
        return json.dumps(self, default=lambda x: x.__dict__, sort_keys=True, indent=4)

class PopulationParams(Object):
    def __init__(self, region, country, population, beds, icus):
        self.populationServed    = int(population)
        self.country             = country
        self.suspectedCasesToday = 10 # NOTE: This defines tMin
        self.importsPerDay       = .01 * float(population)
        self.hospitalBeds        = int(beds)
        self.ICUBeds             = int(icus)
        self.cases               = region

class EpidemiologicalParams(Object):
    def __init__(self, region):
        self.incubationTime     = 5
        self.infectiousPeriod   = 3
        self.lengthHospitalStay = 4
        self.lengthICUStay      = 14
        self.seasonalForcing    = 0.2
        self.peakMonth          = "January"
        self.overflowSeverity   = 2
        if region in FIT_CASE_DATA:
            self.r0 = FIT_CASE_DATA[region]['r0']
        else:
            self.r0 = 2.7

class ContainmentParams(Object):
    def __init__(self):
        self.reduction    = [1.0, 0.8, 0.7, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6]
        self.numberPoints = len(self.reduction)

class DateRange(Object):
    def __init__(self, tMin, tMax):
        self.tMin = tMin
        self.tMax = tMax

class SimulationParams(Object):
    def __init__(self, region):
        tMin = datetime.strftime(datetime.fromordinal(int(FIT_CASE_DATA[region]['tMin'])), '%Y-%m-%d') if region in FIT_CASE_DATA else "2020-03-01"
        tMax = "2020-09-01"
        self.simulationTimeRange  = DateRange(tMin, tMax)
        self.numberStochasticRuns = 0

# TODO: Region and country provide redudant information
#       Condense the information into one field.
class AllParams(Object):
    def __init__(self, region, country, population, beds, icus):
        self.population      = PopulationParams(region, country, population, beds, icus)
        self.epidemiological = EpidemiologicalParams(region)
        self.simulation      = SimulationParams(region)
        self.containment     = ContainmentParams()

# ------------------------------------------------------------------------
# Functions

def marshalJSON(obj, wtr):
    return json.dump(obj, wtr, default=lambda x: x.__dict__, sort_keys=True, indent=4)

def fit_all_case_data():
    Params = Fitter()
    with open("assets/case_counts.json") as fh:
        case_counts = json.load(fh)
        for region, data in case_counts.items():
            fit = Params.fit(data)
            if fit:
                FIT_CASE_DATA[region] = fit

# ------------------------------------------------------------------------
# Main point of entry

if __name__ == "__main__":
    scenario = {}
    fit_all_case_data()

    with open(SCENARIO_POPS, 'r') as fd:
        rdr = csv.reader(fd, delimiter='\t')
        hdr = next(rdr)
        idx = {'name' : hdr.index('name'),
               'size' : hdr.index('populationServed'),
               'ages' : hdr.index('ageDistribution'),
               'beds' : hdr.index('hospitalBeds'),
               'icus' : hdr.index('ICUBeds')}

        args = ['name', 'ages', 'size', 'beds', 'icus']
        for region in rdr:
            if len(region) != len(args):
                continue
            entry = [region[idx[arg]] for arg in args]
            scenario[region[idx['name']]] = AllParams(*entry)

    with open(OUTPUT_JSON, "w+") as fd:
        marshalJSON(scenario, fd)
