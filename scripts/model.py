import csv
import json
from enum import IntEnum

import numpy as np
import scipy.integrate as solve
import scipy.optimize as opt
import matplotlib.pylab as plt

# ------------------------------------------------------------------------
# Globals

PATH_UN_AGES   = "covid19_scenarios/src/assets/data/country_age_distribution.json"
PATH_UN_CODES  = "covid19_scenarios_data/country_codes.csv"
PATH_CASE_DATA = "covid19_scenarios/src/assets/data/case_counts.json"

def load_distribution(path):
    db  = {}
    with open(path, 'r') as fd:
        db = json.load(fd)
        for key, data in db.items():
            db[key] = np.array([data[k] for k in sorted(data.keys())])
            db[key] = db[key]/np.sum(db[key])

    return db

def load_country_codes(path):
    db = {}
    with open(path, 'r') as fd:
        rdr = csv.reader(fd)
        for entry in rdr:
            db[entry[0]] = entry[2]

    return db

N     = 100000
AGES  = load_distribution(PATH_UN_AGES)
CODES = load_country_codes(PATH_UN_CODES)
COUNTRY = "United States of America"
REGION  = "California"

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
    def __init__(self, start, end, delta=1):
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

# ------------------------------------------------------------------------
# Default parameters

DefaultRates = Rates(latency=1/5, R0=3, infection=1/3, hospital=1/3, critical=1/14, imports=1)
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

        fracI = sum(pop[at(Sub.S, age)] for age in range(Age.NUM)) / params.size
        for age in range(Age.NUM):
            # Fluxes
            # TODO: Multiply out fracs and rates outside of hot loop
            flux_S   = params.rates.infectivity*fracI*pop[at(Sub.S, age)]
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
    t_beg  = params.time.start
    t_end  = params.time.end
    dt     = params.time.delta
    num_tp = int((t_end - t_beg)/dt)

    evolve = make_evolve(params)
    solver = solve.ode(evolve) # TODO: Add Jacobian
    solver.set_initial_value(init_pop, t_beg)

    solution = np.zeros((num_tp+1, len(init_pop)))
    solution[0, :] = init_pop

    i = 1
    while solver.successful() and solver.t < t_end:
        solution[i, :] = solver.integrate(solver.t + dt)
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
def assess_model(params, data):
    model = trace_ages(solve_ode(params, init_pop(params.ages, params.size, 1)))

    lsq   = 0
    for i, datum in enumerate(data):
        if datum is None:
            continue
        lsq += np.sum(np.power(model[i] - datum, 2))

    return lsq

# Any parameters given in guess are fit. The remaining are fixed and set by DefaultRates
def fit_params(country, data, guess):
    params_to_fit = {key : i for i, key in enumerate(guess.keys())}

    def pack(x):
        return np.array([guess[key] for key in params_to_fit.keys()])

    def unpack(x):
        vals = { f: (x[params_to_fit[f]] if f in guess else getattr(DefaultRates, f)) for f in RateFields }
        return Rates(**vals), Fracs(x[params_to_fit['reported']]) if 'reported' in params_to_fit else Fracs()

    times = TimeRange(0, max(len(datum)-1 if datum is not None else 0 for datum in data))

    def fit(x):
        param = Params(AGES[country], N, times, *unpack(x))
        return assess_model(param, data)

    fit_param = opt.minimize(fit, pack(guess), method='Nelder-Mead')

    # TODO: repack parameters

    return fit_param

# ------------------------------------------
# Data loading

def make_key(country, region):
    if region is None:
        return country
    else:
        return f"{CODES[country]}-{region}"

# TODO: Better data filtering criteria needed!
# TODO: Take hospitalization and ICU data
def load_data(country, region):
    data = [[] if (i == Sub.D or i == Sub.T) else None for i in range(Sub.NUM)]
    days = []

    key = make_key(country, region)

    with open(PATH_CASE_DATA, 'r') as fd:
        db = json.load(fd)
        ts = db[country]

        days = [d['time'] for d in ts]
        for tp in ts:
            data[Sub.T].append(tp['cases'])
            data[Sub.D].append(tp['deaths'])

    data = [ np.array(d) if d is not None else d for d in data]

    # Filter points
    good_idx = 1 <= data[Sub.T]
    data[Sub.D] = data[Sub.D][good_idx]
    data[Sub.T] = data[Sub.T][good_idx]

    idx = max(np.where(good_idx)[0][0]-5, 0)
    return data, days[idx]

# ------------------------------------------------------------------------
# Testing entry

if __name__ == "__main__":
    # NOTE: For debugging purposes only
    rates = DefaultRates
    fracs = Fracs()
    times = TimeRange(0, 100)
    param = Params(AGES[COUNTRY], N, times, rates, fracs)
    model = trace_ages(solve_ode(param, init_pop(param.ages, param.size, 1)))

    data, day0 = load_data(COUNTRY, REGION)
    guess = { "R0": 3.2, "reported" : 1/30 }
    fit   = fit_params(COUNTRY, model, guess)
