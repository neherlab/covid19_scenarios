import csv
import json
import argparse

from enum import IntEnum
from datetime import datetime

import numpy as np
import scipy.integrate as solve
import scipy.optimize as opt
import matplotlib.pylab as plt

# ------------------------------------------------------------------------
# Globals

PATH_UN_AGES   = "covid19_scenarios/src/assets/data/country_age_distribution.json"
PATH_UN_CODES  = "covid19_scenarios_data/country_codes.csv"
PATH_CASE_DATA = "covid19_scenarios/src/assets/data/case_counts.json"
PATH_POP_DATA  = "covid19_scenarios_data/populationData.tsv"
JAN1_2019      = datetime.strptime("2019-01-01", "%Y-%m-%d").toordinal()
JUN1_2019      = datetime.strptime("2019-06-01", "%Y-%m-%d").toordinal()
JAN1_2020      = datetime.strptime("2020-01-01", "%Y-%m-%d").toordinal()

def load_distribution(path):
    dist = {}
    with open(path, 'r') as fd:
        db = json.load(fd)
        for key, data in db.items():
            dist[key] = np.array([float(data[k]) for k in sorted(data.keys())])
            dist[key] = dist[key]/np.sum(dist[key])

    return dist

def load_country_codes(path):
    db = {}
    with open(path, 'r') as fd:
        rdr = csv.reader(fd)
        next(rdr)
        for entry in rdr:
            db[entry[0]] = entry[2]

    return db

def load_population_data(path):
    db = {}
    with open(path, 'r') as fd:
        rdr = csv.reader(fd, delimiter='\t')
        next(rdr)
        for entry in rdr:
            db[entry[0]] = {'size':int(entry[1]), 'ageDistribution':entry[2]}

    return db

AGES  = load_distribution(PATH_UN_AGES)
POPDATA = load_population_data(PATH_POP_DATA)
CODES = load_country_codes(PATH_UN_CODES)

# ------------------------------------------------------------------------
# Indexing enums

compartments = ['S', 'E1', 'E2', 'E3', 'I', 'H', 'C', 'D', 'R', 'T', 'NUM']
Sub = IntEnum('Sub', compartments, start=0)

groups = ['_0', '_1', '_2', '_3', '_4', '_5', '_6', '_7', '_8', 'NUM']
Age = IntEnum('Age', groups , start=0)

# ------------------------------------------------------------------------
# Organizational classes

class Data(object):
    def __str__(self):
        return str({k : str(v) for k, v in self.__dict__.items()})

class Rates(Data):
    def __init__(self, latency, R0, infection, hospital, critical, imports):
        self.latency     = latency
        self.R0          = R0
        self.infectivity = R0 * infection
        self.infection   = infection
        self.hospital    = hospital
        self.critical    = critical
        self.imports     = imports

# NOTE: Pulled from default severe table on neherlab.org/covid19
#       Keep in sync!
# TODO: Allow custom values?

class Fracs(Data):
    confirmed = np.array([5, 5, 10, 15, 20, 25, 30, 40, 50]) / 100
    severe    = np.array([1, 3, 3, 3, 6, 10, 25, 35, 50]) / 100
    critical  = np.array([5, 10, 10, 15, 20, 25, 35, 45, 55]) / 100
    fatality  = np.array([30, 30, 30, 30, 30, 40, 40, 50, 50]) / 100

    recovery  = 1 - severe
    discharge = 1 - critical
    stabilize = 1 - fatality

    def __init__(self, reported=1/30):
        self.reported = reported

class TimeRange(Data):
    def __init__(self, day0, start, end, delta=1):
        self.day0  = day0
        self.start = start
        self.end   = end
        self.delta = delta

class Params(Data):
    def __init__(self, ages, size, times, rates, fracs):
        self.ages  = ages
        self.rates = rates
        self.fracs = fracs
        self.size  = size
        self.time  = times

        # Make infection function
        phase_offset = (times[0] - JAN1_2019)
        beta = self.rates.infectivity
        def infectivity(t):
            return beta*(1 + 0.2*np.cos(2*np.pi*(t + phase_offset)/365))

        self.rates.infectivity = lambda t:beta #infectivity

# ------------------------------------------------------------------------
# Default parameters

DefaultRates = Rates(latency=1/3.0, R0=2.7, infection=1/3.0, hospital=1/4, critical=1/14, imports=1)
RateFields   = [ f for f in dir(DefaultRates) \
                    if not callable(getattr(DefaultRates, f)) \
                    and not f.startswith("__") ]
RateFields.remove('infectivity')

# ------------------------------------------------------------------------
# Functions

def at(i, j):
    return i + Sub.NUM*j

# ------------------------------------------
# Modeling
def make_evolve(params):
    # Equations for coupled ODEs
    def evolve(t, pop):
        dpop = np.zeros_like(pop)

        fracI = sum(pop[at(Sub.I, age)] for age in range(Age.NUM)) / params.size
        for age in range(Age.NUM):
            # Fluxes
            # TODO: Multiply out fracs and rates outside of hot loop
            flux_S   = params.rates.infectivity(t)*fracI*pop[at(Sub.S, age)] + (params.rates.imports / Sub.NUM)
            flux_E1  = params.rates.latency*pop[at(Sub.E1, age)]*3
            flux_E2  = params.rates.latency*pop[at(Sub.E2, age)]*3
            flux_E3  = params.rates.latency*pop[at(Sub.E3, age)]*3
            flux_I_R = params.rates.infection*params.fracs.recovery[age]*pop[at(Sub.I, age)]
            flux_I_H = params.rates.infection*params.fracs.severe[age]*pop[at(Sub.I, age)]
            flux_H_R = params.rates.hospital*params.fracs.discharge[age]*pop[at(Sub.H, age)]
            flux_H_C = params.rates.hospital*params.fracs.critical[age]*pop[at(Sub.H, age)]
            flux_C_H = params.rates.critical*params.fracs.stabilize[age]*pop[at(Sub.C, age)]
            flux_C_D = params.rates.critical*params.fracs.fatality[age]*pop[at(Sub.C, age)]

            # Add fluxes to states
            dpop[at(Sub.S, age)]  = -flux_S
            dpop[at(Sub.E1, age)] = +flux_S  - flux_E1
            dpop[at(Sub.E2, age)] = +flux_E1 - flux_E2
            dpop[at(Sub.E3, age)] = +flux_E2 - flux_E3
            dpop[at(Sub.I, age)]  = +flux_E3 - flux_I_R - flux_I_H
            dpop[at(Sub.H, age)]  = +flux_I_H + flux_C_H - flux_H_R - flux_H_C
            dpop[at(Sub.C, age)]  = +flux_H_C - flux_C_D - flux_C_H
            dpop[at(Sub.R, age)]  = +flux_H_R + flux_I_R
            dpop[at(Sub.D, age)]  = +flux_C_D
            dpop[at(Sub.T, age)]  = +flux_E3*params.fracs.reported

        return dpop

    return evolve

def init_pop(ages, size, cases):
    pop  = np.zeros(Sub.NUM * Age.NUM)
    ages = np.array(ages) / np.sum(ages)

    case_age = Age.NUM // 2
    for age in range(len(ages)):
        pop[at(Sub.S, age)] = size * ages[age]

    pop[at(Sub.S, case_age)] -= cases
    pop[at(Sub.I, case_age)] += cases

    return pop

def solve_ode(params, init_pop):
    t_beg  = params.time[0]
    num_tp = len(params.time)

    evolve = make_evolve(params)
    solver = solve.ode(evolve) # TODO: Add Jacobian
    solver.set_initial_value(init_pop, t_beg)

    solution = np.zeros((num_tp, len(init_pop)))
    solution[0, :] = init_pop

    i = 1
    while solver.successful() and i<num_tp:
        solution[i, :] = solver.integrate(params.time[i])
        i += 1

    return solution

def trace_ages(solution):
    total = [np.zeros(solution.shape[0]) for _ in range(Sub.NUM)]

    # Sum over age compartments
    for age in range(Age.NUM):
        for pop in range(Sub.NUM):
            total[pop] += solution[:, at(pop, age)]

    return total

# ------------------------------------------
# Parameter estimation
def assess_model(params, data, cases):
    model = trace_ages(solve_ode(params, init_pop(params.ages, params.size, cases)))

    lsq   = 0
    for i, datum in enumerate(data):
        if datum is None:
            continue
        res = np.power(model[i][1:] - datum[1:], 2)
        lsq += np.sum(res)
    print(lsq)

    return lsq

# Any parameters given in guess are fit. The remaining are fixed and set by DefaultRates
def fit_params(key, time_points, data, guess, bounds=None):
    params_to_fit = {key : i for i, key in enumerate(guess.keys())}

    def pack(x, as_list=False):
        data = [x[key] for key in params_to_fit.keys()]
        if not as_list:
            return np.array(data)
        return data

    def unpack(x):
        vals = { f: (x[params_to_fit[f]] if f in guess else getattr(DefaultRates, f)) for f in RateFields }
        return Rates(**vals), Fracs(x[params_to_fit['reported']]) if 'reported' in params_to_fit else Fracs()

    def fit(x):
        param = Params(AGES[POPDATA[key]["ageDistribution"]], POPDATA[key]["size"], time_points, *unpack(x))
        return assess_model(param, data, x[params_to_fit['initial']])

    if bounds is None:
        fit_param = opt.minimize(fit, pack(guess), method='Nelder-Mead')
    else:
        fit_param = opt.minimize(fit, pack(guess), method='TNC', bounds=pack(bounds, as_list=True))

    err = (fit_param.success, fit_param.message)

    return Params(AGES[POPDATA[key]["ageDistribution"]], POPDATA[key]["size"], time_points, *unpack(fit_param.x)), fit_param.x[params_to_fit['initial']], err

# ------------------------------------------
# Data loading

# TODO: Better data filtering criteria needed!
# TODO: Take hospitalization and ICU data?
def load_data(key):
    data = [[] if (i == Sub.D or i == Sub.T) else None for i in range(Sub.NUM)]
    days = []
    case_min, case_max = 20, 5e3

    with open(PATH_CASE_DATA, 'r') as fd:
        db = json.load(fd)
        ts = db[key]

        days = [d['time'] for d in ts]
        for tp in ts:
            data[Sub.T].append(tp['cases'])
            data[Sub.D].append(tp['deaths'])

    data = [ np.array(d) if d is not None else d for d in data]

    # Filter points
    good_idx = np.bitwise_and(case_min <= data[Sub.T], data[Sub.T] < case_max)
    data[Sub.D] = np.concatenate([[np.nan], data[Sub.D][good_idx]])
    data[Sub.T] = np.concatenate([[np.nan], data[Sub.T][good_idx]])

    # np.where(good_idx)[0][0] is the first day with case_min cases
    # start the model 3 weeks prior.
    idx = max(np.where(good_idx)[0][0]-21, 0)
    day0 = datetime.strptime(days[idx], "%Y-%m-%d").toordinal()

    times = np.array([day0] + [datetime.strptime(days[i], "%Y-%m-%d").toordinal()
                      for i in np.where(good_idx)[0]])

    return times, data

# ------------------------------------------------------------------------
# Testing entry

if __name__ == "__main__":

    parser = argparse.ArgumentParser(description = "",
                                     usage="fit data")

    parser.add_argument('--key', type=str, help="key for region, e.g 'USA-California'")
    args = parser.parse_args()

    # NOTE: For debugging purposes only
    # rates = DefaultRates
    # fracs = Fracs()
    # times = TimeRange(0, 100)
    # param = Params(AGES[COUNTRY], POPDATA[make_key(COUNTRY, REGION)], times, rates, fracs)
    # model = trace_ages(solve_ode(param, init_pop(param.ages, param.size, 1)))

    time_points, data = load_data(args.key)

    guess = { "R0": 4.3,
              "reported" : 1/30,
              "initial" : 10}
              # "hospital" : 1/5}
              # "imports": 4, }
    # bounds = { "R0" : (2, 5),
    #           "reported" : (0, 1),
    #           "initial" : (.01, 1e2),
    #           "hospital" : (1/100, 5),
    #           "imports": (1, 1e5) }

    param, init_cases, err = fit_params(args.key, time_points, data, guess)

    model = trace_ages(solve_ode(param, init_pop(param.ages, param.size, init_cases)))
    tp = param.time - JAN1_2020
    plt.plot(tp, data[Sub.T], 'o')
    plt.plot(tp, np.round(model[Sub.T]))

    plt.plot(tp, data[Sub.D], 'o')
    plt.plot(tp, np.round(model[Sub.D]))

    plt.plot(tp, np.round(model[Sub.I]))

    plt.yscale('log')
