import csv
import importlib
import sys
sys.path.append('..')
import os
import json
import argparse

from enum import IntEnum
from datetime import datetime

import numpy as np
import scipy.integrate as solve
import scipy.optimize as opt
import matplotlib.pylab as plt
from scripts.tsv import parse as parse_tsv
from scipy.signal import savgol_filter
from paths import BASE_PATH

# ------------------------------------------------------------------------
# Globals

PATH_UN_AGES   = os.path.join(BASE_PATH, "..//src/assets/data/country_age_distribution.json")
PATH_UN_CODES  = os.path.join(BASE_PATH,"country_codes.csv")
PATH_POP_DATA  = os.path.join(BASE_PATH,"populationData.tsv")
JAN1_2019      = datetime.strptime("2019-01-01", "%Y-%m-%d").toordinal()
JUN1_2019      = datetime.strptime("2019-06-01", "%Y-%m-%d").toordinal()
JAN1_2020      = datetime.strptime("2020-01-01", "%Y-%m-%d").toordinal()

CASES = importlib.import_module(f"scripts.tsv")
CASE_DATA = CASES.parse()

def load_distribution(path):
    dist = {}
    with open(path, 'r') as fd:
        db = json.load(fd)
        for data in db:
            key = data["country"]
            ageDis = data["ageDistribution"]
            dist[key] = np.array([float(ageDis[k]) for k in sorted(ageDis.keys())])
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
    def __init__(self, latency, logR0, infection, hospital, critical, imports):
        self.latency     = latency
        self.logR0       = logR0
        self.infectivity = np.exp(self.logR0) * infection
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
    severe   *= confirmed
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
        # phase_offset = (times[0] - JAN1_2019)
        beta = self.rates.infectivity
        # def infectivity(t):
        #     return beta*(1 + 0.2*np.cos(2*np.pi*(t + phase_offset)/365))

        self.rates.infectivity = lambda t:beta #infectivity

# ------------------------------------------------------------------------
# Default parameters

DefaultRates = Rates(latency=1/3.0, logR0=1.0, infection=1/3.0, hospital=1/4, critical=1/14, imports=.1)
RateFields   = [ f for f in dir(DefaultRates) \
                    if not callable(getattr(DefaultRates, f)) \
                    and not f.startswith("__") ]
RateFields.remove('infectivity')

# ------------------------------------------------------------------------
# Functions

# ------------------------------------------
# Modeling
def make_evolve(params):
    # Equations for coupled ODEs
    def evolve(t, pop):
        pop2d = np.reshape(pop, (Sub.NUM, Age.NUM))
        fracI = pop2d[Sub.I, :].sum() / params.size
        dpop = np.zeros_like(pop2d)

        flux_S   = params.rates.infectivity(t)*fracI*pop2d[Sub.S] + (params.rates.imports / Sub.NUM)

        flux_E1  = params.rates.latency*pop2d[Sub.E1]*3
        flux_E2  = params.rates.latency*pop2d[Sub.E2]*3
        flux_E3  = params.rates.latency*pop2d[Sub.E3]*3

        flux_I_R = params.rates.infection*params.fracs.recovery*pop2d[Sub.I]
        flux_I_H = params.rates.infection*params.fracs.severe*pop2d[Sub.I]
        flux_H_R = params.rates.hospital*params.fracs.discharge*pop2d[Sub.H]
        flux_H_C = params.rates.hospital*params.fracs.critical*pop2d[Sub.H]
        flux_C_H = params.rates.critical*params.fracs.stabilize*pop2d[Sub.C]
        flux_C_D = params.rates.critical*params.fracs.fatality*pop2d[Sub.C]

        # Add fluxes to states
        dpop[Sub.S]  = -flux_S
        dpop[Sub.E1] = +flux_S  - flux_E1
        dpop[Sub.E2] = +flux_E1 - flux_E2
        dpop[Sub.E3] = +flux_E2 - flux_E3
        dpop[Sub.I]  = +flux_E3 - flux_I_R - flux_I_H
        dpop[Sub.H]  = +flux_I_H + flux_C_H - flux_H_R - flux_H_C
        dpop[Sub.C]  = +flux_H_C - flux_C_D - flux_C_H
        dpop[Sub.R]  = +flux_H_R + flux_I_R
        dpop[Sub.D]  = +flux_C_D
        dpop[Sub.T]  = +flux_E3*params.fracs.reported

        return np.reshape(dpop, Sub.NUM*Age.NUM)

    return evolve


def init_pop(ages, size, cases):
    pop  = np.zeros((Sub.NUM, Age.NUM))
    ages = np.array(ages) / np.sum(ages)

    pop[Sub.S, :] = size * ages

    pop[Sub.S, :]  -= cases*ages
    pop[Sub.I, :]  += cases*ages*0.3
    pop[Sub.E1, :] += cases*ages*0.7/3
    pop[Sub.E2, :] += cases*ages*0.7/3
    pop[Sub.E3, :] += cases*ages*0.7/3

    return pop

def solve_ode(params, init_pop):
    t_beg  = params.time[0]
    num_tp = len(params.time)

    evolve = make_evolve(params)
    solver = solve.ode(evolve) # TODO: Add Jacobian
    solver.set_initial_value(init_pop.flatten(), t_beg)

    solution = np.zeros((num_tp, init_pop.shape[0], init_pop.shape[1]))
    solution[0, :, :] = init_pop

    i = 1
    while solver.successful() and i<num_tp:
        solution[i, :, :] = np.reshape(solver.integrate(params.time[i]), (Sub.NUM, Age.NUM))
        i += 1

    return solution


def trace_ages(solution):
    return solution.sum(axis=-1)

# ------------------------------------------
# Parameter estimation
def is_cumulative(vec):
    return not False in (vec[:-1]<=vec[1:])

def relevant_idxs(vec):
    #Filter the relevant data points. Zeros after previous non-zero data is discarded
    #Data points before first non-zero over a certain time window are discarded.
    #This time window is computed as the time it would take to grow from a 10 person
    #population to the first datapoint concidering doubling time of 5 days

    # Terrible workaround the masked values. I don't know how to handle that properly
    relevance_weights = np.ones_like(vec[1:])
    idx = np.nonzero(vec[1:])
    idx = idx[0][0]+1
    value = vec[idx]
    back_time_discard = 5*np.log(value)/np.log(10)

    relevance_weights[[np.bitwise_and(x>idx, vec[x]<value) for x in range(1,len(vec))]] = 0
    relevance_weights[[np.bitwise_and(x<idx, x>idx-back_time_discard) for x in range(1,len(vec))]] = 0
    relevance_weights = np.concatenate(([0], relevance_weights)) #masked value

    return relevance_weights.astype(bool)

def last_exp_idxs(t, data):
    def expgrowth_end(t, vec):
        # Return idx such that vec[idx] gives the last point of the exponential growth phase
        def smooth(vec):
            return savgol_filter(vec, 11, 3) # arbitrarily found to give the best results

        dvec = smooth(np.gradient(vec, t))
        dvec[np.isnan(dvec)] = 0
        return np.argmax(dvec)

    idx_cases = expgrowth_end(t, data[Sub.T])
    idx_hospitalized = max(min(idx_cases+5, len(data[Sub.H])-1), expgrowth_end(t, data[Sub.H]))
    idx_ICU = max(min(idx_hospitalized+2, len(data[Sub.C])-1), expgrowth_end(t, data[Sub.C]))
    idx_deaths = max(min(idx_hospitalized+1, len(data[Sub.D])-1), expgrowth_end(t, data[Sub.D]))

    return [idx_cases, idx_deaths, idx_hospitalized, idx_ICU]

def relevant_exp_idx(vec, last_exp_idx):
    tmp = np.ones_like(vec)
    tmp[last_exp_idx+1:] = 0
    return tmp.astype(bool)

def assess_model(params, data, tp, cases):
    sol = solve_ode(params, init_pop(params.ages, params.size, cases))
    model = trace_ages(sol)

    last_exp = last_exp_idxs(tp, data)

    case_cost = 10*np.sum(np.power(model[1:last_exp[0],Sub.T] - data[Sub.T][1:last_exp[0]], 2))
    death_cost = 10000*np.sum(np.power(model[1:last_exp[1],Sub.D] - data[Sub.D][1:last_exp[1]], 2))

    hospitalized_cost = 0
    ICU_cost = 0
    if data[Sub.H][-1] != 0 and is_cumulative(data[Sub.H][1:]):
        idxs = np.bitwise_and(relevant_idxs(data[Sub.H]), relevant_exp_idx(data[Sub.H], last_exp[2]))
        hospitalized_cost = np.sum(np.power(np.cumsum(model[idxs,Sub.H]) - data[Sub.H][idxs], 2))

    if data[Sub.C][-1] != 0 and is_cumulative(data[Sub.C][1:]):
        idxs = np.bitwise_and(relevant_idxs(data[Sub.C]), relevant_exp_idx(data[Sub.H], last_exp[3]))
        ICU_cost = np.sum(np.power(np.cumsum(model[idxs,Sub.C]) - data[Sub.C][idxs], 2))

    return case_cost + death_cost + hospitalized_cost + ICU_cost


# Any parameters given in guess are fit. The remaining are fixed and set by DefaultRates
def fit_params(key, time_points, data, guess, bounds=None):
    if key not in POPDATA:
        return Params(None, None, None, DefaultRates, Fracs()), 10, (False, "Not within population database")

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
        return assess_model(param, data, time_points, np.exp(x[params_to_fit['logInitial']]))

    if bounds is None:
        fit_param = opt.minimize(fit, pack(guess), method='Nelder-Mead')
    else:
        fit_param = opt.minimize(fit, pack(guess), method='TNC', bounds=bounds)

    err = (fit_param.success, fit_param.message)
    print(key, fit_param.x)
    return (Params(AGES[POPDATA[key]["ageDistribution"]], POPDATA[key]["size"], time_points,
           *unpack(fit_param.x)), np.exp(fit_param.x[params_to_fit['logInitial']]), err)

# ------------------------------------------
# Data loading

# TODO: Better data filtering criteria needed!
# TODO: Take hospitalization and ICU data?
def load_data(key):
    if key in POPDATA:
        popsize = POPDATA[key]["size"]
    else:
        popsize = 1e6

    data = [[] if (i == Sub.D or i == Sub.T or i == Sub.H or i == Sub.C) else None for i in range(Sub.NUM)]
    days = []
    case_min, case_max = 20, max(20000, popsize*3e-3)

    ts = CASE_DATA[key]

    days = [d['time'].split('T')[0] for d in ts]
    for tp in ts:
        data[Sub.T].append(tp['cases'] or np.nan)
        data[Sub.D].append(tp['deaths'] or np.nan)
        data[Sub.H].append(tp['hospitalized'] or 0)
        data[Sub.C].append(tp['icu'] or 0)

    data = [ np.array(d) if d is not None else d for d in data]

    # Filter points
    good_idx = np.bitwise_and(case_min <= data[Sub.T], data[Sub.T] < case_max)
    data[Sub.D] = np.ma.array(np.concatenate([[np.nan], data[Sub.D][good_idx]]))
    data[Sub.T] = np.ma.array(np.concatenate([[np.nan], data[Sub.T][good_idx]]))
    data[Sub.H] = np.ma.array(np.concatenate([[np.nan], data[Sub.H][good_idx]]))
    data[Sub.C] = np.ma.array(np.concatenate([[np.nan], data[Sub.C][good_idx]]))
    data[Sub.D].mask = np.isnan(data[Sub.D])
    data[Sub.T].mask = np.isnan(data[Sub.T])
    data[Sub.H].mask = np.isnan(data[Sub.H])
    data[Sub.C].mask = np.isnan(data[Sub.C])

    if sum(good_idx) == 0:
        return None, None

    # np.where(good_idx)[0][0] is the first day with case_min cases
    # start the model 3 weeks prior.
    idx = np.where(good_idx)[0][0]
    day0 = datetime.strptime(days[idx], "%Y-%m-%d").toordinal()-21

    times = np.array([day0] + [datetime.strptime(days[i], "%Y-%m-%d").toordinal()
                      for i in np.where(good_idx)[0]])

    return times, data


def fit_population(region, guess=None):
    time_points, data = load_data(region)
    if data is None or len(data[Sub.D]) <= 5:
        return None

    if guess is None:
        guess = { "logR0": 1.0,
                  "reported" : 0.3,
                  "logInitial" : 1
                }

    param, init_cases, err = fit_params(region, time_points, data, guess, bounds=((0.4,2),(0.05,0.8),(None,None)))
    tMin = datetime.strftime(datetime.fromordinal(time_points[0]), '%Y-%m-%d')
    return {'params':param, 'initialCases':init_cases, 'tMin':tMin, 'data': data, 'error':err}


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

    keys = ["CHE-Basel-Stadt", "USA-California", "ITA-Lombardia", "FRA-Ile-de-France", "DEU-Berlin", "Iceland"]
    for key in keys:

        res = fit_population(key)
        model = trace_ages(solve_ode(res['params'], init_pop(res['params'].ages, res['params'].size, res['initialCases'])))
        tp = res['params'].time - JAN1_2020
        tp = tp - tp[0]

        plt.figure()
        plt.title(f"New fit {key}")
        plt.plot(tp, res['data'][Sub.T], 'o', color='#a9a9a9', label="cases")
        plt.plot(tp, model[:,Sub.T], color="#a9a9a9", label="predicted cases")

        plt.plot(tp, res['data'][Sub.D], 'o', color="#cab2d6", label="deaths")
        plt.plot(tp, model[:,Sub.D], color="#cab2d6", label="predicated deaths")

        plt.plot(tp, res['data'][Sub.H], 'o', color="#fb9a98", label="Hospitalized")
        plt.plot(tp, model[:,Sub.H], color="#fb9a98", label="Predicted hospitalized")

        plt.plot(tp, res['data'][Sub.C], 'o', color="#e31a1c", label="ICU")
        plt.plot(tp, model[:,Sub.C], color="#e31a1c", label="Predicted ICU")

        plt.plot(tp, model[:,Sub.I], color="#fdbe6e", label="infected")
        plt.plot(tp, model[:,Sub.R], color="#36a130", label="recovered")

        plt.xlabel("Time [days]")
        plt.ylabel("Number of people")
        plt.legend(loc="best")
        # plt.yscale('log')
    plt.show()
