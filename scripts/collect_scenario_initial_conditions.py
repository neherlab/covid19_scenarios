import json

# ------------------------------------------------------------------------
# Parameter classes
#
# IMPORTANT: Keep in sync with algorithm parameters of input [AllParamsFlat]
#            covid19_scenarios/src/algorithm/types/Param.types.ts

class Object:
    def marshalJSON(self):
        return json.dumps(self, default=lambda x: x.__dict__, sort_keys=True, indent=4)

class PopulationParams(Object):
    def __init__(self):
        self.populationServed = 1
        self.country = "test"
        self.suspectedCasesToday = 2
        self.importsPerDay = 2
        self.hospitalBeds = 2
        self.ICUBeds = 2
        self.cases = "test"

class EpidemiologicalParams(Object):
    def __init__(self):
        self.r0 = 3
        self.incubationTime = 5
        self.infectiousPeriod = 3
        self.lengthHospitalStay = 4
        self.lengthICUStay = 14
        self.seasonalForcing = 0.2
        self.peakMonth = "January"
        self.overflowSeverity = 2

class ContainmentParams(Object):
    def __init__(self):
        self.reduction = []
        self.numberPoints = len(self.reduction)

class DateRange(Object):
    def __init__(self):
        self.tMin = "min"
        self.tMax = "max"

class SimulationParams(Object):
    def __init__(self):
        self.simulationTimeRange = DateRange()
        self.numberStochasticRuns = 10

class AllParams(Object):
    def __init__(self):
        self.population      = PopulationParams()
        self.epidemiological = EpidemiologicalParams()
        self.simulation      = SimulationParams()
        self.containment     = ContainmentParams()

# ------------------------------------------------------------------------
# Functions

# ------------------------------------------------------------------------
# Main point of entry

if __name__ == "__main__":
    params = AllParams()
    print(params.marshalJSON())
