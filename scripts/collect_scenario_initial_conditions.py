import csv
import json

# ------------------------------------------------------------------------
# Globals

SCENARIO_POPS = "static_scenario_data.tsv"
OUTPUT_JSON   = "scenario_defaults.json"

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
        self.suspectedCasesToday = 10
        self.importsPerDay       = .01 * float(population)
        self.hospitalBeds        = int(beds)
        self.ICUBeds             = int(icus)
        self.cases               = region

class EpidemiologicalParams(Object):
    def __init__(self):
        self.r0                 = 2.7
        self.incubationTime     = 5
        self.infectiousPeriod   = 3
        self.lengthHospitalStay = 4
        self.lengthICUStay      = 14
        self.seasonalForcing    = 0.2
        self.peakMonth          = "January"
        self.overflowSeverity   = 2

class ContainmentParams(Object):
    def __init__(self):
        self.reduction = [1.0, 0.8, 0.7, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6]
        self.numberPoints = len(self.reduction)

class DateRange(Object):
    def __init__(self, min, max):
        self.tMin = min
        self.tMax = max

class SimulationParams(Object):
    def __init__(self):
        self.simulationTimeRange  = DateRange("2020-03-01", "2020-09-01")
        self.numberStochasticRuns = 10

# TODO: Region and country provide redudant information
class AllParams(Object):
    def __init__(self, region, country, population, beds, icus):
        self.population      = PopulationParams(region, country, population, beds, icus)
        self.epidemiological = EpidemiologicalParams()
        self.simulation      = SimulationParams()
        self.containment     = ContainmentParams()

# ------------------------------------------------------------------------
# Functions

def marshalJSON(obj, wtr):
    return json.dump(obj, wtr, default=lambda x: x.__dict__, sort_keys=True, indent=4)

# ------------------------------------------------------------------------
# Main point of entry

if __name__ == "__main__":
    scenario = {}
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
