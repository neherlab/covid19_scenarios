import csv
import importlib
import sys
sys.path.append('..')
import os
import json
import argparse
import copy

from enum import IntEnum
from datetime import datetime

import numpy as np
import scipy.integrate as solve
import scipy.optimize as opt
import matplotlib.pylab as plt
from scripts.tsv import parse as parse_tsv
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
    def __init__(self, latency, logR0, infection, hospital, critical, imports, efficacy):
        self.latency     = latency
        self.logR0       = logR0
        self.infectivity = np.exp(self.logR0) * infection
        self.infection   = infection
        self.hospital    = hospital
        self.critical    = critical
        self.imports     = imports
        self.efficacy    = efficacy

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
    def __init__(self, ages=None, size=None, date=None, times=None, rates=None, fracs=None):
        self.ages  = ages
        self.rates = rates
        self.fracs = fracs
        self.size  = size
        self.time  = times
        self.date  = date

        # Make infection function
        beta = self.rates.infectivity
        self.rates.infectivity = lambda t,date,eff : beta if t<date else beta*(1-eff)

# ------------------------------------------------------------------------
# Default parameters

DefaultRates = Rates(latency=1/3.0, logR0=1.0, infection=1/3.0, hospital=1/4, critical=1/14, imports=.1, efficacy=0.5)
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

        flux_S   = params.rates.infectivity(t, params.date, params.rates.efficacy)*fracI*pop2d[Sub.S] + (params.rates.imports / Sub.NUM)

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
    return not False in (vec[~vec.mask][:-1]<=vec[~vec.mask][1:])

def poissonNegLogLH(n,lam, eps=0.1):
    L = np.abs(lam)
    N = np.abs(n)
    return (L-N) - N*np.log((L+eps)/(N+eps))

def assess_model(params, data, cases):
    sol = solve_ode(params, init_pop(params.ages, params.size, cases))
    model = trace_ages(sol)

    eps = 1e-2
    case_cost =  np.ma.sum(poissonNegLogLH(data[Sub.T], model[:,Sub.T], eps))
    death_cost = np.ma.sum(poissonNegLogLH(data[Sub.D], model[:,Sub.D], eps))

    hospital_cost = 0
    ICU_cost = 0
    if data[Sub.H] is not None:
        hospital_cost = np.ma.sum(poissonNegLogLH(data[Sub.H], model[:,Sub.H], eps))
    if data[Sub.C] is not None:
        ICU_cost = np.ma.sum(poissonNegLogLH(data[Sub.C], model[:,Sub.C], eps))

    return case_cost + 10*death_cost # + hospital_cost + ICU_cost


# Any parameters given in guess are fit. The remaining are fixed and set by DefaultRates
def fit_params(key, time_points, data, guess, confinement_start, bounds=None):
    if key not in POPDATA:
        return (Params(ages=None, size=None, date=None, times=None, rates=DefaultRates, fracs=Fracs()),
                10, (False, "Not within population database"))

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
        # TODO(nnoll): Need a better default here!
        if POPDATA[key]["ageDistribution"] in AGES:
            ages = AGES[POPDATA[key]["ageDistribution"]]
        else:
            ages = AGES["Switzerland"]
        rates, fracs = unpack(x)
        param = Params(ages=AGES[POPDATA[key]["ageDistribution"]], size=POPDATA[key]["size"],
                       date=confinement_start, times=time_points, rates=rates, fracs=fracs)
        return assess_model(param, data, np.exp(x[params_to_fit['logInitial']]))

    if bounds is None:
        fit_param = opt.minimize(fit, pack(guess), method='Nelder-Mead')
    else:
        fit_param = opt.minimize(fit, pack(guess), method='L-BFGS-B', bounds=bounds)

    err = (fit_param.success, fit_param.message)
    print(key, fit_param.x)
    if POPDATA[key]["ageDistribution"] in AGES:
        ages = AGES[POPDATA[key]["ageDistribution"]]
    else:
        ages = AGES["Switzerland"]

    rates, fracs = unpack(fit_param.x)
    return (Params(ages=AGES[POPDATA[key]["ageDistribution"]], size=POPDATA[key]["size"],
                   date=confinement_start, times=time_points, rates=rates, fracs=fracs),
           np.exp(fit_param.x[params_to_fit['logInitial']]), err)

# ------------------------------------------
# Data loading

def load_data(key, ts):
    if key in POPDATA:
        popsize = POPDATA[key]["size"]
    else:
        popsize = 1e6

    case_min = 20
    data = [[] if (i == Sub.D or i == Sub.T or i == Sub.H or i == Sub.C) else None for i in range(Sub.NUM)]
    days = []

    for tp in ts: #replace all zeros by np.nan
        data[Sub.T].append(tp['cases'] or np.nan)
        data[Sub.H].append(tp['hospitalized'] or np.nan)
        data[Sub.D].append(tp['deaths'] or np.nan)
        data[Sub.C].append(tp['icu'] or np.nan)

    data = [ np.ma.array(d) if d is not None else d for d in data]
    good_idx = np.array(case_min <= data[Sub.T])

    for ii in [Sub.D, Sub.T, Sub.H, Sub.C]:
        data[ii] = data[ii][good_idx]
        data[ii].mask = np.isnan(data[ii])
        if False not in data[ii].mask:
            data[ii] = None

    days = np.array([datetime.strptime(d['time'].split('T')[0], "%Y-%m-%d").toordinal() for d in ts])
    return days[good_idx], data


def get_fit_data(days, data_original, confinement_start=None):
    data = copy.deepcopy(data_original)
    case_min = 20

    if confinement_start is None:
        fit_stop_day = days[-1]
    else:
        fit_stop_day = confinement_start + 1.0/DefaultRates.latency + 1.0/DefaultRates.infection
    day0 = days[case_min <= data[Sub.T]][0]

    # Filter points
    good_idx = np.bitwise_and(days >= day0, days <= fit_stop_day)
    for idx in [Sub.D, Sub.T, Sub.H, Sub.C]:
        if data[idx] is None:
            data[idx] = np.ma.array([np.nan])
            data[idx].mask = np.isnan(data[idx])
        else:
            data[idx] = np.ma.array(np.concatenate([[np.nan], data[idx][good_idx]]))
            data[idx].mask = np.isnan(data[idx])

    for ii in [Sub.T, Sub.D, Sub.H, Sub.C]: # remove data if whole array is masked
        if False not in data[ii].mask:
            data[ii] = None

    # start the model 3 weeks prior.
    time = np.concatenate(([day0-21], days[good_idx]))
    return time, data



def fit_population(key, time_points, data, confinement_start, guess=None):
    if data is None or data[Sub.D] is None or len(data[Sub.D]) <= 5:
        return None

    if guess is None:
        guess = { "logR0": 1.0,
                  "reported" : 0.2,
                  "logInitial" : 1,
                  "efficacy" : 0.8
                }
    # bounds = ((0.4,2),(0.01,0.8),(1,None),(0,1))
    bounds=None

    for ii in [Sub.T, Sub.D]:
        if not is_cumulative(data[ii]):
            print("Cases / deaths count is not cumulative.", data[ii])

    param, init_cases, err = fit_params(key, time_points, data, guess, confinement_start, bounds=bounds)
    tMin = datetime.strftime(datetime.fromordinal(time_points[0]), '%Y-%m-%d')
    res = {'params': param, 'initialCases': init_cases, 'tMin': tMin, 'data': data, 'error':err}
    if param.date is not None:
        res['containment_start'] = datetime.fromordinal(param.date).strftime('%Y-%m-%d')

    return res

# ------------------------------------------------------------------------
# Testing entry

def fit_error(data, model):
    err = [[] if (i == Sub.D or i == Sub.T or i == Sub.H or i == Sub.C) else None for i in range(Sub.NUM)]

    eps = 1e-2
    for idx in [Sub.T, Sub.D, Sub.H, Sub.C]:
        if data[idx] is not None:
            err[idx] = poissonNegLogLH(data[idx], model[:,idx], eps)

    return err

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

    key = args.key or "USA-New York"
    # key = "CHE-Basel-Stadt"
    # key = "DEU-Berlin"
    confinement_start = datetime.strptime("2020-03-20", "%Y-%m-%d").toordinal()
    # confinement_start = datetime.strptime("2020-03-13", "%Y-%m-%d").toordinal()
    # confinement_start = datetime.strptime("2020-03-16", "%Y-%m-%d").toordinal()
    # confinement_start = None

    # Raw data and time points
    time, data = load_data(key, CASE_DATA[key])
    model_tps, fit_data = get_fit_data(time, data, confinement_start=None)

    # Fitting over the pre-confinement days
    res = fit_population(key, model_tps, fit_data, confinement_start)
    model = trace_ages(solve_ode(res['params'], init_pop(res['params'].ages, res['params'].size, res['initialCases'])))
    err = fit_error(fit_data, model)
    if confinement_start is not None:
        confinement_start -= res['params'].time[0]
    time -= res['params'].time[0]
    tp = res['params'].time - res['params'].time[0]

    # plt.figure()
    # plt.title(f"{key}")
    # plt.plot(time, data[Sub.T], 'o', color='#a9a9a9', label="cases")
    # plt.plot(tp, model[:,Sub.T], color="#a9a9a9", label="predicted cases")
    #
    # plt.plot(time, data[Sub.D], 'o', color="#cab2d6", label="deaths")
    # plt.plot(tp, model[:,Sub.D], color="#cab2d6", label="predicated deaths")
    #
    # plt.plot(time, data[Sub.H], 'o', color="#fb9a98", label="Hospitalized")
    # plt.plot(tp, model[:,Sub.H], color="#fb9a98", label="Predicted hospitalized")
    #
    # plt.plot(time, data[Sub.C], 'o', color="#e31a1c", label="ICU")
    # plt.plot(tp, model[:,Sub.C], color="#e31a1c", label="Predicted ICU")
    #
    # plt.plot(tp, model[:,Sub.I], color="#fdbe6e", label="infected")
    # plt.plot(tp, model[:,Sub.R], color="#36a130", label="recovered")
    #
    # if confinement_start is not None:
    #     plt.plot(confinement_start, data[Sub.T][time==confinement_start], 'kx', markersize=20, label="Confinement start")
    #
    # plt.xlabel("Time [days]")
    # plt.ylabel("Number of people")
    # plt.legend(loc="best")
    # plt.tight_layout()
    # # plt.yscale('log')
    # # plt.ylim([-100,1000])
    # plt.savefig("Basel-Stadt", format="png")
    # plt.show()

    plt.figure()
    plt.title(f"{key}")
    plt.plot(time, data[Sub.T], 'o', color='#a9a9a9', label="cases")
    plt.plot(tp, model[:,Sub.T], color="#a9a9a9", label="predicted cases")
    plt.plot(tp, err[Sub.T], '--', color="#a9a9a9", label="cases error")

    plt.plot(time, data[Sub.D], 'o', color="#cab2d6", label="deaths")
    plt.plot(tp, model[:,Sub.D], color="#cab2d6")
    plt.plot(tp, err[Sub.D], '--', color="#cab2d6")

    if data[Sub.H] is not None:
        plt.plot(time, data[Sub.H], 'o', color="#fb9a98", label="Hospitalized")
        plt.plot(tp, model[:,Sub.H], color="#fb9a98")
        plt.plot(tp, err[Sub.H], '--', color="#fb9a98")

    if data[Sub.C] is not None:
        plt.plot(time, data[Sub.C], 'o', color="#e31a1c", label="ICU")
        plt.plot(tp, model[:,Sub.C], color="#e31a1c")
        plt.plot(tp, err[Sub.C], '--', color="#e31a1c")


    plt.plot(tp, model[:,Sub.I], color="#fdbe6e", label="infected")
    plt.plot(tp, model[:,Sub.R], color="#36a130", label="recovered")
    if confinement_start is not None:
        plt.plot(confinement_start, data[Sub.T][time==confinement_start], 'kx', markersize=20, label="Confinement start")

    plt.xlabel("Time [days]")
    plt.ylabel("Number of people")
    plt.legend(loc="best")
    plt.tight_layout()
    # plt.yscale("log")
    # plt.savefig(f"{key}-Poisson_max_likelihood", format="png")
    plt.show()
