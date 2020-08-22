import sys
import csv
import os
import json
import numpy as np
import multiprocessing as multi
import yaml

from uuid import uuid4
sys.path.append('..')

import generated.types as schema

from datetime import datetime, timedelta
from scipy.stats import linregress
from paths import TMP_CASES, BASE_PATH, JSON_DIR, FIT_PARAMETERS
from scripts.tsv import parse as parse_tsv
from scripts.model import get_fit_data, fit_population_iterative, Sub, get_IFR, get_reporting_fraction, fit_params
from scripts.load_utils import get_case_data, load_distribution, load_population_data, cumulative_to_rolling_average, convert_to_vectors
from jsonschema import validate, FormatChecker

from typing import List

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

FIT_CASE_DATA = {}

from scripts.default_schema_values import DEFAULTS

# ------------------------------------------------------------------------
# Parameter class constructors (with defaults)

class PercentageRange(schema.PercentageRange):
    def __init__(self, x):
        super(PercentageRange, self).__init__( \
                begin = float(min(99,max(1, round((1-0.4*x*(100-x)*1e-4)*x, 1)))),
                end =   float(min(99,max(1, round((1+0.4*x*(100-x)*1e-4)*x, 1)))))

class NumericRange(schema.NumericRangeNonNegative):
    def __init__(self, x):
        super(NumericRange, self).__init__( \
                begin = float(max(1, round(.9*x, 2))),
                end = float(max(1, round(1.1*x, 2))))

    def mean(self):
        return (self.begin + self.end)/2

class DateRange(schema.DateRange):
    def __init__(self, tMin, tMax):
        super(DateRange, self).__init__( \
                begin = tMin,
                end = tMax)

class MitigationInterval(schema.MitigationInterval):
    def __init__(self, name='Intervention', tMin=None, tMax=None, id='', color='#cccccc', mitigationValue=0):
        super(MitigationInterval, self).__init__( \
                color = color,
                transmission_reduction = PercentageRange(mitigationValue),
                name = name,
                time_range = DateRange(tMin, tMax))

class PopulationParams(schema.ScenarioDatumPopulation):
    def __init__(self, region, age_distribution_name, population, beds, icus, cases_key, seroprevalence=0.0,
                 imports_per_day=0.1, initial_number_of_cases=0):
        super(PopulationParams, self).__init__( \
                case_counts_name=cases_key,
                age_distribution_name=age_distribution_name,
                hospital_beds=int(beds),
                icu_beds=int(icus),
                imports_per_day=imports_per_day,
                population_served=int(population),
                seroprevalence=float(seroprevalence),
                initial_number_of_cases=initial_number_of_cases
                )

class EpidemiologicalParams(schema.ScenarioDatumEpidemiological):
    def __init__(self, region, r0=None, hemisphere=None):
        default = DEFAULTS["EpidemiologicalData"]
        if hemisphere:
            if hemisphere == 'Northern':
                default['seasonal_forcing'] = 0.0
                default['peak_month']       = 0
            elif hemisphere == 'Southern':
                default['seasonal_forcing'] = 0.0
                default['peak_month']       = 6
            elif hemisphere == 'Tropical':
                default['seasonal_forcing'] = 0.0
                default['peak_month']       = 6
            else:
                print(f'Error: Could not parse hemisphere for {region} in scenarios.py')

        super(EpidemiologicalParams, self).__init__( \
                infectious_period_days = default["infectiousPeriod"],
                latency_days = default["latencyTime"],
                hospital_stay_days = default["lengthHospitalStay"],
                icu_stay_days = default["lengthICUStay"],
                overflow_severity = default["overflowSeverity"],
                peak_month = default["peakMonth"],
                r0 = NumericRange(r0 if r0 else default["r0"]),
                seasonal_forcing = default["seasonalForcing"])

class MitigationParams(schema.ScenarioDatumMitigation):
    def __init__(self):
        default = DEFAULTS["ContainmentData"]
        super(MitigationParams, self).__init__(
                mitigation_intervals=[])

class SimulationParams(schema.ScenarioDatumSimulation):
    def __init__(self, region, tMin=None, tMax=None):
        super(SimulationParams, self).__init__( \
                simulation_time_range = DateRange( \
                    datetime.strptime(tMin if tMin else "2020-03-01", '%Y-%m-%d').date(),
                    datetime.strptime(tMax if tMax else "2020-08-31", '%Y-%m-%d').date()),
                number_stochastic_runs = 15)

# TODO: Region and country provide redudant information
#       Condense the information into one field.
class AllParams(schema.ScenarioDatum):
    def __init__(self, name=None, ages=None, size=None, beds=None, icus=None, hemisphere=None, r0=None,
                 srcPopulation=None, srcHospitalBeds=None, srcICUBeds=None, cases_key=None, tMin=None, tMax=None):
        super(AllParams, self).__init__( \
                mitigation = MitigationParams(),
                epidemiological = EpidemiologicalParams(name, r0, hemisphere),
                population = PopulationParams(name, ages, size, beds, icus, cases_key),
                simulation = SimulationParams(name, tMin=tMin, tMax=tMax)
        )

class ScenarioData(schema.ScenarioData):
    def __init__(self, all_params: AllParams, name: str):
        super(ScenarioData, self).__init__(
                data = all_params,
                name = name)

class ScenarioArray(schema.ScenarioArray):
    def __init__(self, data: List[ScenarioData]):
        super(ScenarioArray, self).__init__(all = data)

    def marshalJSON(self, wtr=None):
        if wtr is None:
            return json.dumps(self.to_dict(), default=lambda x: x.__dict__, sort_keys=True, indent=2)
        else:
            return wtr.write(json.dumps(self.to_dict(), sort_keys=True, indent=2))


# ------------------------------------------------------------------------
# Functions
def fit_REblocks(time, Re, min_samples_leaf = 21):
    from sklearn import tree

    t = tree.DecisionTreeRegressor(min_samples_leaf = min_samples_leaf)
    t.fit(time.reshape(-1,1), Re)
    return t

def fit_population(args):
    tp_to_eval_seroprevalence = 30
    from scripts.estimate_R0 import estimate_Re
    from scripts.load_utils import cumulative_to_rolling_average
    region, json_case_data, pop_params, age_distribution, return_fit_res = args

    print(f"starting fit for {region}")
    time_range_fit = 60
    data = convert_to_vectors(json_case_data)
    weekly_data = cumulative_to_rolling_average(data)
    if weekly_data['cases'] is None or weekly_data['deaths'] is None:
        return (region, None, None) if return_fit_res else (region, None)

    weekly_data_for_fit = {k:v[-time_range_fit:] for k,v in weekly_data.items()}

    # estimate Re and bound from above (usually a problem at the very beginning of a wave)
    res = estimate_Re(weekly_data['cases'], imports=1, cutoff=5, chop=3)
    Re = np.minimum(pop_params['r0'], res['Re'])
    Refit = fit_REblocks(weekly_data['time'][:-8], Re)
    piecewise_constant_Re = Refit.predict(weekly_data['time'].reshape(-1,1))
    change_points = np.concatenate([[-1], np.where(np.diff(piecewise_constant_Re)!=0)[0], [len(Re)-1]]) + 1

    total_deaths_at_start = data['deaths'][-tp_to_eval_seroprevalence]
    IFR = get_IFR(age_distribution)
    reporting_fraction = get_reporting_fraction(data['cases'], data['deaths'], IFR)
    n_cases_at_start = total_deaths_at_start/IFR
    seroprevalence = n_cases_at_start / pop_params['size']
    if np.isnan(seroprevalence) or (type(seroprevalence)==np.ma.core.MaskedConstant and seroprevalence.mask==True):
        seroprevalence = 0

    mitigations = []
    for ci,cp in enumerate(change_points[:-1]):
        mitigations.append({'tMin':int(weekly_data['time'][cp]),
                            'tMax':int(weekly_data['time'][change_points[ci+1]-1]),
                            'value': max(0,min(1, float(1-piecewise_constant_Re[cp]/(1-seroprevalence)/pop_params['r0'])))})


    tmin = weekly_data_for_fit['time'][0]
    average_Re = np.mean(Re[-time_range_fit:])
    fixed_params = {'logR0': np.log(pop_params['r0']), 'efficacy': 1-average_Re/pop_params['r0'], 'containment_start':tmin,
                    'seroprevalence':seroprevalence, 'reported': reporting_fraction}
    if (weekly_data_for_fit['cases'][0]):
        guess =  {'logInitial':np.log((0.5 + weekly_data_for_fit['cases'][0])/reporting_fraction)}
    elif (weekly_data_for_fit['deaths'][0]) and reporting_fraction>0:
        guess =  {'logInitial':np.log((0.5 + weekly_data_for_fit['deaths'][0])/reporting_fraction/IFR)}
    elif (weekly_data_for_fit['deaths'][0]):
        guess =  {'logInitial':np.log((0.5 + weekly_data_for_fit['deaths'][0])/0.3/IFR)}
    else:
        guess =  {'logInitial':np.log(1)}

    fit_result, success = fit_params(data['time'][-time_range_fit-7:], weekly_data_for_fit, guess,
                            age_distribution, pop_params['size'], fixed_params = fixed_params)

    params = {}
    params.update(fixed_params)
    for p in guess:
        params[p] = fit_result.__getattribute__(p)
    for p in params:
        params[p] = float(params[p])

    params['mitigations'] = mitigations
    params['tMin'] = datetime.fromordinal(tmin).date().strftime('%Y-%m-%d')
    params['tMax'] = datetime.fromordinal(tmin+90).date().strftime('%Y-%m-%d')
    if return_fit_res:
        return (region, params, fit_result)
    else:
        return (region, params)
        import ipdb; ipdb.set_trace()

def fit_all_case_data(num_procs=4):
    pool = multi.Pool(num_procs)
    print(f"Pooling with {num_procs} processors")
    case_counts = parse_tsv()
    scenario_data = load_population_data()
    age_distributions = load_distribution()
    params = []

    for region in case_counts:
        if region in scenario_data:
            params.append([region, case_counts[region], scenario_data.get(region,None), age_distributions[scenario_data[region]['ages']], False])
    results = pool.map(fit_population, params)

    results_dict = {}
    for k, params in results:
        if params is None:
            results_dict[k] = None
        elif np.isfinite(params['logInitial']):
            results_dict[k] = params
        else:
            results_dict[k] = None

    return results_dict


def set_mitigation(scenario, mitigations):
    for mi,m in enumerate(mitigations):
        name = f"Intervention {mi}"
        scenario.mitigation.mitigation_intervals.append(MitigationInterval(
            name=name,
            tMin=datetime.fromordinal(m['tMin']).date(),
            id=uuid4(),
            tMax=datetime.fromordinal(m['tMax']).date() + timedelta(1),
            color=mitigation_colors.get(name, "#cccccc"),
            # mitigationValue=report_errors(round(100*fit_params['efficacy']), 0, 100)))
            mitigationValue=round(100*max(0, min(1, m['value'])))))


# ------------------------------------------------------------------------
# Main point of entry

def generate(output_json, num_procs=1, recalculate=False):
    import re
    scenarios = []
    case_counts = parse_tsv()
    scenario_data = load_population_data()

    for fname in (FIT_PARAMETERS, 'fit_parameters_1stwave.json'):
        print("reading file", fname)
        fit_fname = os.path.join(BASE_PATH,fname)
        if recalculate or (not os.path.isfile(fit_fname)):
            results = fit_all_case_data(num_procs)
            with open(fit_fname, 'w') as fh:
                json.dump(results, fh)
        else:
            with open(fit_fname, 'r') as fh:
                results = json.load(fh)

        for region in scenario_data:
            if region not in results or results[region] is None:
                continue
            if '1stwave' in fname: # skip if a small region or not fit to case data (no 'containment_start')
                results[region]['logInitial'] = np.log(results[region]['initialCases'])
                results[region]['tMax'] = '2020-08-31'
                results[region]['seroprevalence'] = 0.0
                if (re.match('[A-Z][A-Z][A-Z]-', region) and results[region]['initialCases']<100) or ('containment_start' not in results[region]):
                    continue
            elif np.isnan(results[region]['logInitial']) or np.isinf(results[region]['logInitial']):
                continue

            scenario = AllParams(**scenario_data[region], tMin=results[region]['tMin'], tMax=results[region]['tMax'],
                                cases_key=region if region in case_counts else 'None')
            if '1stwave' in fname:
                scenario.mitigation.mitigation_intervals = [MitigationInterval(
                    name="Intervention 1",
                    tMin=datetime.strptime(results[region]['containment_start'], '%Y-%m-%d').date(),
                    id=uuid4(),
                    tMax=scenario.simulation.simulation_time_range.end + timedelta(1),
                    color=mitigation_colors.get("Intervention 1", "#cccccc"),
                    mitigationValue=round(100*results[region]['efficacy']))]
            elif region in case_counts:
                set_mitigation(scenario, results[region].get('mitigations', []))
            else:
                scenario.mitigation.mitigation_intervals = []
            if len(scenario.mitigation.mitigation_intervals):
                scenario.mitigation.mitigation_intervals[-1].time_range.end = datetime.strptime(results[region]['tMax'], '%Y-%m-%d').date() + timedelta(1)
            scenario.population.seroprevalence = round(100*results[region]['seroprevalence'],2)
            scenario.population.initial_number_of_cases = int(round(np.exp(results[region]['logInitial'])))

            if '1stwave' in fname:
                scenario_name = f"[1st wave] {region}"
            else:
                scenario_name = region

            scenarios.append(ScenarioData(scenario, scenario_name))

    with open(output_json, "w+") as fd:
        output = ScenarioArray(scenarios)
        output.marshalJSON(fd)


if __name__ == '__main__':

    generate('test.json', recalculate=False)

    from scripts.test_fitting_procedure import generate_data, check_fit
    from scripts.model import trace_ages, get_IFR
    from matplotlib import pyplot as plt

    case_counts = parse_tsv()
    scenario_data = load_population_data()
    age_distributions = load_distribution()
    region = 'JPN-Kagawa'
    #region = 'United States of America'
    age_dis = age_distributions[scenario_data[region]['ages']]
    region, p, fit_params = fit_population((region, case_counts[region], scenario_data[region], age_dis, True))

    model_data = generate_data(fit_params)
    model_cases = model_data['cases'][7:] - model_data['cases'][:-7]
    model_deaths = model_data['deaths'][7:] - model_data['deaths'][:-7]
    model_time = fit_params.time[7:]

    cases = cumulative_to_rolling_average(convert_to_vectors(case_counts[region]))

    print(fit_params.reported, np.exp(fit_params.logInitial))
    print(get_IFR(age_dis))

    plt.plot(model_time, model_cases)
    plt.plot(model_time, model_deaths)
    plt.plot(cases['time'], cases['cases'])
    plt.plot(cases['time'], cases['deaths'])
    plt.yscale('log')
