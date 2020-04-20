# This code parses date/times, so please
#
#     pip install python-dateutil
#
# To use this code, make sure you
#
#     import json
#
# and then, to convert JSON from a string, do
#
#     result = case_counts_from_dict(json.loads(json_string))
#     result = country_age_distribution_from_dict(json.loads(json_string))
#     result = integer_from_dict(json.loads(json_string))
#     result = integer_positive_from_dict(json.loads(json_string))
#     result = scenario_from_dict(json.loads(json_string))
#     result = severity_from_dict(json.loads(json_string))

from typing import Optional, Any, List, TypeVar, Callable, Type, cast
from datetime import datetime
from uuid import UUID
from enum import Enum
import dateutil.parser


T = TypeVar("T")
EnumT = TypeVar("EnumT", bound=Enum)


def from_int(x: Any) -> int:
    assert isinstance(x, int) and not isinstance(x, bool)
    return x


def from_none(x: Any) -> Any:
    assert x is None
    return x


def from_union(fs, x):
    for f in fs:
        try:
            return f(x)
        except:
            pass
    assert False


def from_datetime(x: Any) -> datetime:
    return dateutil.parser.parse(x)


def from_str(x: Any) -> str:
    assert isinstance(x, str)
    return x


def from_list(f: Callable[[Any], T], x: Any) -> List[T]:
    assert isinstance(x, list)
    return [f(y) for y in x]


def to_class(c: Type[T], x: Any) -> dict:
    assert isinstance(x, c)
    return cast(Any, x).to_dict()


def from_float(x: Any) -> float:
    assert isinstance(x, (float, int)) and not isinstance(x, bool)
    return float(x)


def to_float(x: Any) -> float:
    assert isinstance(x, float)
    return x


def to_enum(c: Type[EnumT], x: Any) -> EnumT:
    assert isinstance(x, c)
    return x.value


class EmpiricalDatum:
    cases: Optional[int]
    deaths: Optional[int]
    hospitalized: Optional[int]
    icu: Optional[int]
    recovered: Optional[int]
    time: datetime

    def __init__(self, cases: Optional[int], deaths: Optional[int], hospitalized: Optional[int], icu: Optional[int], recovered: Optional[int], time: datetime) -> None:
        self.cases = cases
        self.deaths = deaths
        self.hospitalized = hospitalized
        self.icu = icu
        self.recovered = recovered
        self.time = time

    @staticmethod
    def from_dict(obj: Any) -> 'EmpiricalDatum':
        assert isinstance(obj, dict)
        cases = from_union([from_int, from_none], obj.get("cases"))
        deaths = from_union([from_int, from_none], obj.get("deaths"))
        hospitalized = from_union([from_int, from_none], obj.get("hospitalized"))
        icu = from_union([from_int, from_none], obj.get("icu"))
        recovered = from_union([from_int, from_none], obj.get("recovered"))
        time = from_datetime(obj.get("time"))
        return EmpiricalDatum(cases, deaths, hospitalized, icu, recovered, time)

    def to_dict(self) -> dict:
        result: dict = {}
        result["cases"] = from_union([from_int, from_none], self.cases)
        result["deaths"] = from_union([from_int, from_none], self.deaths)
        result["hospitalized"] = from_union([from_int, from_none], self.hospitalized)
        result["icu"] = from_union([from_int, from_none], self.icu)
        result["recovered"] = from_union([from_int, from_none], self.recovered)
        result["time"] = self.time.isoformat()
        return result


class CaseCountsForOneCountry:
    country: str
    empirical_data: List[EmpiricalDatum]

    def __init__(self, country: str, empirical_data: List[EmpiricalDatum]) -> None:
        self.country = country
        self.empirical_data = empirical_data

    @staticmethod
    def from_dict(obj: Any) -> 'CaseCountsForOneCountry':
        assert isinstance(obj, dict)
        country = from_str(obj.get("country"))
        empirical_data = from_list(EmpiricalDatum.from_dict, obj.get("empiricalData"))
        return CaseCountsForOneCountry(country, empirical_data)

    def to_dict(self) -> dict:
        result: dict = {}
        result["country"] = from_str(self.country)
        result["empiricalData"] = from_list(lambda x: to_class(EmpiricalDatum, x), self.empirical_data)
        return result


class AgeDistribution:
    the_09: int
    the_1019: int
    the_2029: int
    the_3039: int
    the_4049: int
    the_5059: int
    the_6069: int
    the_7079: int
    the_80: int

    def __init__(self, the_09: int, the_1019: int, the_2029: int, the_3039: int, the_4049: int, the_5059: int, the_6069: int, the_7079: int, the_80: int) -> None:
        self.the_09 = the_09
        self.the_1019 = the_1019
        self.the_2029 = the_2029
        self.the_3039 = the_3039
        self.the_4049 = the_4049
        self.the_5059 = the_5059
        self.the_6069 = the_6069
        self.the_7079 = the_7079
        self.the_80 = the_80

    @staticmethod
    def from_dict(obj: Any) -> 'AgeDistribution':
        assert isinstance(obj, dict)
        the_09 = from_int(obj.get("0-9"))
        the_1019 = from_int(obj.get("10-19"))
        the_2029 = from_int(obj.get("20-29"))
        the_3039 = from_int(obj.get("30-39"))
        the_4049 = from_int(obj.get("40-49"))
        the_5059 = from_int(obj.get("50-59"))
        the_6069 = from_int(obj.get("60-69"))
        the_7079 = from_int(obj.get("70-79"))
        the_80 = from_int(obj.get("80+"))
        return AgeDistribution(the_09, the_1019, the_2029, the_3039, the_4049, the_5059, the_6069, the_7079, the_80)

    def to_dict(self) -> dict:
        result: dict = {}
        result["0-9"] = from_int(self.the_09)
        result["10-19"] = from_int(self.the_1019)
        result["20-29"] = from_int(self.the_2029)
        result["30-39"] = from_int(self.the_3039)
        result["40-49"] = from_int(self.the_4049)
        result["50-59"] = from_int(self.the_5059)
        result["60-69"] = from_int(self.the_6069)
        result["70-79"] = from_int(self.the_7079)
        result["80+"] = from_int(self.the_80)
        return result


class AgeDistributionForOneCountry:
    age_distribution: AgeDistribution
    country: str

    def __init__(self, age_distribution: AgeDistribution, country: str) -> None:
        self.age_distribution = age_distribution
        self.country = country

    @staticmethod
    def from_dict(obj: Any) -> 'AgeDistributionForOneCountry':
        assert isinstance(obj, dict)
        age_distribution = AgeDistribution.from_dict(obj.get("ageDistribution"))
        country = from_str(obj.get("country"))
        return AgeDistributionForOneCountry(age_distribution, country)

    def to_dict(self) -> dict:
        result: dict = {}
        result["ageDistribution"] = to_class(AgeDistribution, self.age_distribution)
        result["country"] = from_str(self.country)
        return result


class DateRange:
    t_max: datetime
    t_min: datetime

    def __init__(self, t_max: datetime, t_min: datetime) -> None:
        self.t_max = t_max
        self.t_min = t_min

    @staticmethod
    def from_dict(obj: Any) -> 'DateRange':
        assert isinstance(obj, dict)
        t_max = from_datetime(obj.get("tMax"))
        t_min = from_datetime(obj.get("tMin"))
        return DateRange(t_max, t_min)

    def to_dict(self) -> dict:
        result: dict = {}
        result["tMax"] = self.t_max.isoformat()
        result["tMin"] = self.t_min.isoformat()
        return result


class MitigationInterval:
    color: str
    id: UUID
    mitigation_value: float
    name: str
    time_range: DateRange

    def __init__(self, color: str, id: UUID, mitigation_value: float, name: str, time_range: DateRange) -> None:
        self.color = color
        self.id = id
        self.mitigation_value = mitigation_value
        self.name = name
        self.time_range = time_range

    @staticmethod
    def from_dict(obj: Any) -> 'MitigationInterval':
        assert isinstance(obj, dict)
        color = from_str(obj.get("color"))
        id = UUID(obj.get("id"))
        mitigation_value = from_float(obj.get("mitigationValue"))
        name = from_str(obj.get("name"))
        time_range = DateRange.from_dict(obj.get("timeRange"))
        return MitigationInterval(color, id, mitigation_value, name, time_range)

    def to_dict(self) -> dict:
        result: dict = {}
        result["color"] = from_str(self.color)
        result["id"] = str(self.id)
        result["mitigationValue"] = to_float(self.mitigation_value)
        result["name"] = from_str(self.name)
        result["timeRange"] = to_class(DateRange, self.time_range)
        return result


class ContainmentData:
    mitigation_intervals: List[MitigationInterval]
    number_points: Optional[float]

    def __init__(self, mitigation_intervals: List[MitigationInterval], number_points: Optional[float]) -> None:
        self.mitigation_intervals = mitigation_intervals
        self.number_points = number_points

    @staticmethod
    def from_dict(obj: Any) -> 'ContainmentData':
        assert isinstance(obj, dict)
        mitigation_intervals = from_list(MitigationInterval.from_dict, obj.get("mitigationIntervals"))
        number_points = from_union([from_float, from_none], obj.get("numberPoints"))
        return ContainmentData(mitigation_intervals, number_points)

    def to_dict(self) -> dict:
        result: dict = {}
        result["mitigationIntervals"] = from_list(lambda x: to_class(MitigationInterval, x), self.mitigation_intervals)
        result["numberPoints"] = from_union([to_float, from_none], self.number_points)
        return result


class EpidemiologicalData:
    infectious_period: float
    latency_time: float
    length_hospital_stay: float
    length_icu_stay: float
    overflow_severity: float
    peak_month: int
    r0: float
    seasonal_forcing: float

    def __init__(self, infectious_period: float, latency_time: float, length_hospital_stay: float, length_icu_stay: float, overflow_severity: float, peak_month: int, r0: float, seasonal_forcing: float) -> None:
        self.infectious_period = infectious_period
        self.latency_time = latency_time
        self.length_hospital_stay = length_hospital_stay
        self.length_icu_stay = length_icu_stay
        self.overflow_severity = overflow_severity
        self.peak_month = peak_month
        self.r0 = r0
        self.seasonal_forcing = seasonal_forcing

    @staticmethod
    def from_dict(obj: Any) -> 'EpidemiologicalData':
        assert isinstance(obj, dict)
        infectious_period = from_float(obj.get("infectiousPeriod"))
        latency_time = from_float(obj.get("latencyTime"))
        length_hospital_stay = from_float(obj.get("lengthHospitalStay"))
        length_icu_stay = from_float(obj.get("lengthICUStay"))
        overflow_severity = from_float(obj.get("overflowSeverity"))
        peak_month = from_int(obj.get("peakMonth"))
        r0 = from_float(obj.get("r0"))
        seasonal_forcing = from_float(obj.get("seasonalForcing"))
        return EpidemiologicalData(infectious_period, latency_time, length_hospital_stay, length_icu_stay, overflow_severity, peak_month, r0, seasonal_forcing)

    def to_dict(self) -> dict:
        result: dict = {}
        result["infectiousPeriod"] = to_float(self.infectious_period)
        result["latencyTime"] = to_float(self.latency_time)
        result["lengthHospitalStay"] = to_float(self.length_hospital_stay)
        result["lengthICUStay"] = to_float(self.length_icu_stay)
        result["overflowSeverity"] = to_float(self.overflow_severity)
        result["peakMonth"] = from_int(self.peak_month)
        result["r0"] = to_float(self.r0)
        result["seasonalForcing"] = to_float(self.seasonal_forcing)
        return result


class PopulationData:
    cases: str
    country: str
    hospital_beds: int
    icu_beds: int
    imports_per_day: float
    population_served: int
    suspected_cases_today: int

    def __init__(self, cases: str, country: str, hospital_beds: int, icu_beds: int, imports_per_day: float, population_served: int, suspected_cases_today: int) -> None:
        self.cases = cases
        self.country = country
        self.hospital_beds = hospital_beds
        self.icu_beds = icu_beds
        self.imports_per_day = imports_per_day
        self.population_served = population_served
        self.suspected_cases_today = suspected_cases_today

    @staticmethod
    def from_dict(obj: Any) -> 'PopulationData':
        assert isinstance(obj, dict)
        cases = from_str(obj.get("cases"))
        country = from_str(obj.get("country"))
        hospital_beds = from_int(obj.get("hospitalBeds"))
        icu_beds = from_int(obj.get("ICUBeds"))
        imports_per_day = from_float(obj.get("importsPerDay"))
        population_served = from_int(obj.get("populationServed"))
        suspected_cases_today = from_int(obj.get("suspectedCasesToday"))
        return PopulationData(cases, country, hospital_beds, icu_beds, imports_per_day, population_served, suspected_cases_today)

    def to_dict(self) -> dict:
        result: dict = {}
        result["cases"] = from_str(self.cases)
        result["country"] = from_str(self.country)
        result["hospitalBeds"] = from_int(self.hospital_beds)
        result["ICUBeds"] = from_int(self.icu_beds)
        result["importsPerDay"] = to_float(self.imports_per_day)
        result["populationServed"] = from_int(self.population_served)
        result["suspectedCasesToday"] = from_int(self.suspected_cases_today)
        return result


class SimulationData:
    number_stochastic_runs: float
    simulation_time_range: DateRange

    def __init__(self, number_stochastic_runs: float, simulation_time_range: DateRange) -> None:
        self.number_stochastic_runs = number_stochastic_runs
        self.simulation_time_range = simulation_time_range

    @staticmethod
    def from_dict(obj: Any) -> 'SimulationData':
        assert isinstance(obj, dict)
        number_stochastic_runs = from_float(obj.get("numberStochasticRuns"))
        simulation_time_range = DateRange.from_dict(obj.get("simulationTimeRange"))
        return SimulationData(number_stochastic_runs, simulation_time_range)

    def to_dict(self) -> dict:
        result: dict = {}
        result["numberStochasticRuns"] = to_float(self.number_stochastic_runs)
        result["simulationTimeRange"] = to_class(DateRange, self.simulation_time_range)
        return result


class AllParams:
    containment: ContainmentData
    epidemiological: EpidemiologicalData
    population: PopulationData
    simulation: SimulationData

    def __init__(self, containment: ContainmentData, epidemiological: EpidemiologicalData, population: PopulationData, simulation: SimulationData) -> None:
        self.containment = containment
        self.epidemiological = epidemiological
        self.population = population
        self.simulation = simulation

    @staticmethod
    def from_dict(obj: Any) -> 'AllParams':
        assert isinstance(obj, dict)
        containment = ContainmentData.from_dict(obj.get("containment"))
        epidemiological = EpidemiologicalData.from_dict(obj.get("epidemiological"))
        population = PopulationData.from_dict(obj.get("population"))
        simulation = SimulationData.from_dict(obj.get("simulation"))
        return AllParams(containment, epidemiological, population, simulation)

    def to_dict(self) -> dict:
        result: dict = {}
        result["containment"] = to_class(ContainmentData, self.containment)
        result["epidemiological"] = to_class(EpidemiologicalData, self.epidemiological)
        result["population"] = to_class(PopulationData, self.population)
        result["simulation"] = to_class(SimulationData, self.simulation)
        return result


class ScenarioForOneCountry:
    all_params: AllParams
    country: str

    def __init__(self, all_params: AllParams, country: str) -> None:
        self.all_params = all_params
        self.country = country

    @staticmethod
    def from_dict(obj: Any) -> 'ScenarioForOneCountry':
        assert isinstance(obj, dict)
        all_params = AllParams.from_dict(obj.get("allParams"))
        country = from_str(obj.get("country"))
        return ScenarioForOneCountry(all_params, country)

    def to_dict(self) -> dict:
        result: dict = {}
        result["allParams"] = to_class(AllParams, self.all_params)
        result["country"] = from_str(self.country)
        return result


class AgeGroup(Enum):
    THE_09 = "0-9"
    THE_1019 = "10-19"
    THE_2029 = "20-29"
    THE_3039 = "30-39"
    THE_4049 = "40-49"
    THE_5059 = "50-59"
    THE_6069 = "60-69"
    THE_7079 = "70-79"
    THE_80 = "80+"


class SeverityElement:
    age_group: AgeGroup
    confirmed: float
    critical: float
    fatal: float
    id: float
    isolated: float
    severe: float

    def __init__(self, age_group: AgeGroup, confirmed: float, critical: float, fatal: float, id: float, isolated: float, severe: float) -> None:
        self.age_group = age_group
        self.confirmed = confirmed
        self.critical = critical
        self.fatal = fatal
        self.id = id
        self.isolated = isolated
        self.severe = severe

    @staticmethod
    def from_dict(obj: Any) -> 'SeverityElement':
        assert isinstance(obj, dict)
        age_group = AgeGroup(obj.get("ageGroup"))
        confirmed = from_float(obj.get("confirmed"))
        critical = from_float(obj.get("critical"))
        fatal = from_float(obj.get("fatal"))
        id = from_float(obj.get("id"))
        isolated = from_float(obj.get("isolated"))
        severe = from_float(obj.get("severe"))
        return SeverityElement(age_group, confirmed, critical, fatal, id, isolated, severe)

    def to_dict(self) -> dict:
        result: dict = {}
        result["ageGroup"] = to_enum(AgeGroup, self.age_group)
        result["confirmed"] = to_float(self.confirmed)
        result["critical"] = to_float(self.critical)
        result["fatal"] = to_float(self.fatal)
        result["id"] = to_float(self.id)
        result["isolated"] = to_float(self.isolated)
        result["severe"] = to_float(self.severe)
        return result


def case_counts_from_dict(s: Any) -> List[CaseCountsForOneCountry]:
    return from_list(CaseCountsForOneCountry.from_dict, s)


def case_counts_to_dict(x: List[CaseCountsForOneCountry]) -> Any:
    return from_list(lambda x: to_class(CaseCountsForOneCountry, x), x)


def country_age_distribution_from_dict(s: Any) -> List[AgeDistributionForOneCountry]:
    return from_list(AgeDistributionForOneCountry.from_dict, s)


def country_age_distribution_to_dict(x: List[AgeDistributionForOneCountry]) -> Any:
    return from_list(lambda x: to_class(AgeDistributionForOneCountry, x), x)


def integer_from_dict(s: Any) -> int:
    return from_int(s)


def integer_to_dict(x: int) -> Any:
    return from_int(x)


def integer_positive_from_dict(s: Any) -> int:
    return from_int(s)


def integer_positive_to_dict(x: int) -> Any:
    return from_int(x)


def scenario_from_dict(s: Any) -> List[ScenarioForOneCountry]:
    return from_list(ScenarioForOneCountry.from_dict, s)


def scenario_to_dict(x: List[ScenarioForOneCountry]) -> Any:
    return from_list(lambda x: to_class(ScenarioForOneCountry, x), x)


def severity_from_dict(s: Any) -> List[SeverityElement]:
    return from_list(SeverityElement.from_dict, s)


def severity_to_dict(x: List[SeverityElement]) -> Any:
    return from_list(lambda x: to_class(SeverityElement, x), x)
