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
from scripts.R0_estimator import get_Re_guess

# ------------------------------------------------------------------------
# Indexing enums

compartments = ['S', 'E1', 'E2', 'E3', 'I', 'H', 'C', 'D', 'R', 'T', 'NUM']
Sub = IntEnum('Sub', compartments, start=0)

groups = ['_0', '_1', '_2', '_3', '_4', '_5', '_6', '_7', '_8', 'NUM']
Age = IntEnum('Age', groups , start=0)

# ------------------------------------------------------------------------
# Default parameters
DefaultRates = {"latency":1/3.0, "logR0":1.0, "infection":1/3.0, "hospital":1/3.0, "critical":1/14, "imports":.1, "efficacy":0.5}
RateFields   = list(DefaultRates.keys())

# ------------------------------------------------------------------------
# Organizational classes

class Data(object):
    def __str__(self):
        return str({k : str(v) for k, v in self.__dict__.items()})

class TimeRange(Data):
    def __init__(self, day0, start, end, delta=1):
        self.day0  = day0
        self.start = start
        self.end   = end
        self.delta = delta

class Params(Data):
    """
    Parameters needed to run the model. Initialized to default values. No default value for logR0 as if it
    is not set the self.infectivity function doesn't give proper values.
    """
    def __init__(self, logR0, ages=None, size=None, containment_start=None, times=None,
                 logInitial=None, seroprevalence=0):
        self.ages               = ages
        self.size               = size
        self.time               = times
        self.containment_start  = containment_start
        self.seroprevalence = seroprevalence

        # Rates
        self.latency     = DefaultRates["latency"]
        self.logR0       = logR0
        self.infection   = DefaultRates["infection"]
        self.beta = np.exp(self.logR0) * self.infection
        self.hospital    = DefaultRates["hospital"]
        self.critical    = DefaultRates["critical"]
        self.imports     = DefaultRates["imports"]
        self.efficacy    = DefaultRates["efficacy"]

        # Fracs
        self.confirmed = np.array([5, 5, 10, 15, 20, 25, 30, 40, 50]) / 100
        self.severe    = np.array([1, 3, 3, 3, 6, 10, 25, 35, 50]) / 100
        self.severe   *= self.confirmed
        self.palliative       = np.array([0, 0, 0, 0, 0, 0, 5, 10, 20]) / 100
        self.icu       = np.array([5, 10, 10, 15, 20, 25, 30, 25, 15]) / 100
        self.fatality  = np.array([10, 10, 10, 10, 10, 20, 30, 40, 50]) / 100

        self.recovery  = 1 - self.severe
        self.discharge = 1 - self.icu
        self.stabilize = 1 - self.fatality

        self.reported   = 1/30
        self.logInitial = logInitial or 1
        # Make infection function
        self.infectivity = lambda t,containment_start,eff,beta : beta if t<containment_start else beta*(1-eff)

# ------------------------------------------------------------------------
# Functions

def get_IFR(age_distribution):
    params = Params(0)
    ifr_by_age = params.severe*(params.palliative + params.icu*params.fatality)
    return np.sum(age_distribution*ifr_by_age)

def get_reporting_fraction(cases, deaths, IFR, right_censoring=30, n_days=60):
    left_index = max(0,len(cases) - right_censoring - n_days)
    right_index = max(0,len(cases) - right_censoring)
    n_cases = cases[right_index] - cases[left_index]
    n_deaths = deaths[right_index] - deaths[left_index]
    if n_deaths:
        reported = IFR*n_cases/n_deaths
        if np.isfinite(reported):
            return reported

    return 0.3

# ------------------------------------------
# Modeling
def make_evolve(params):
    # Equations for coupled ODEs
    def evolve(t, pop):
        pop2d = np.reshape(pop, (Sub.NUM, Age.NUM))
        fracI = pop2d[Sub.I, :].sum() / params.size
        dpop = np.zeros_like(pop2d)

        flux_S   = params.infectivity(t, params.containment_start, params.efficacy, params.beta)*fracI*pop2d[Sub.S] + (params.imports / Sub.NUM)

        flux_E1  = params.latency*pop2d[Sub.E1]*3
        flux_E2  = params.latency*pop2d[Sub.E2]*3
        flux_E3  = params.latency*pop2d[Sub.E3]*3

        flux_I_R = params.infection*params.recovery*pop2d[Sub.I]
        flux_I_H = params.infection*params.severe*pop2d[Sub.I]
        flux_H_R = params.hospital*params.discharge*pop2d[Sub.H]
        flux_H_C = params.hospital*params.icu*pop2d[Sub.H]
        flux_H_D = params.hospital*params.palliative*pop2d[Sub.H]
        flux_C_H = params.critical*params.stabilize*pop2d[Sub.C]
        flux_C_D = params.critical*params.fatality*pop2d[Sub.C]

        # Add fluxes to states
        dpop[Sub.S]  = -flux_S
        dpop[Sub.E1] = +flux_S  - flux_E1
        dpop[Sub.E2] = +flux_E1 - flux_E2
        dpop[Sub.E3] = +flux_E2 - flux_E3
        dpop[Sub.I]  = +flux_E3 - flux_I_R - flux_I_H
        dpop[Sub.H]  = +flux_I_H + flux_C_H - flux_H_R - flux_H_C - flux_H_D
        dpop[Sub.C]  = +flux_H_C - flux_C_D - flux_C_H
        dpop[Sub.R]  = +flux_H_R + flux_I_R
        dpop[Sub.D]  = +flux_C_D + flux_H_D
        dpop[Sub.T]  = +flux_E3*params.reported

        return np.reshape(dpop, Sub.NUM*Age.NUM)

    return evolve


def init_pop(ages, size, cases, seroprevalence):
    pop  = np.zeros((Sub.NUM, Age.NUM))
    ages = np.array(ages) / np.sum(ages)

    # split population into recovered (from previous wave) and susceptible
    pop[Sub.S, :] = size * ages * (1-seroprevalence)
    pop[Sub.R, :] = size * ages * seroprevalence

    pop[Sub.S, :]  -= cases*ages
    # 30% of cases in infectious category
    pop[Sub.I, :]  += cases*ages*0.3
    # 70% of cases spread evenly over the exposed categories
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
    solver.set_integrator('dopri5')

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

def get_rolling_numbers(model_out, smooting=7):
    return (model_out[smooting:, Sub.T] - model_out[:-smooting, Sub.T],
            model_out[smooting:, Sub.D] - model_out[:-smooting, Sub.D])


def assess_model(params, data):
    sol = solve_ode(params, init_pop(params.ages, params.size, np.exp(params.logInitial), params.seroprevalence))
    model = trace_ages(sol)
    eps = 1e-2
    diff_cases_model, diff_deaths_model = get_rolling_numbers(model)
    case_cost =  np.ma.sum(poissonNegLogLH(data['cases'], diff_cases_model, eps))
    death_cost = np.ma.sum(poissonNegLogLH(data['deaths'], diff_deaths_model, eps))

    return case_cost + 10*death_cost


# Any parameters given in guess are fit. The remaining are fixed and set by DefaultRates
def fit_params(time_points, data, guess, ages, popsize, fixed_params=None, bounds=None):
    """
    Fitting function used to estimate logInitial and reported fraction with the given fixed parameters.
    """
    def create_params(fixed_params, fit_params):
        param = Params(ages=ages, size=popsize, logR0=fixed_params['logR0'], times=time_points)
        for ii in fixed_params.keys(): # Setting the fixed params
            setattr(param, ii, fixed_params[ii])
        for idx,name in enumerate(params_to_fit): # Setting the params for/from fitting
            setattr(param, name, fit_params[idx])
        return param

    def fit(x):
        return assess_model(create_params(fixed_params, x), data)


    if fixed_params is None:
        fixed_params = {}

    params_to_fit = guess.keys()
    guess = np.array([guess[key] for key in guess.keys()])

    if bounds is None:
        fit_param = opt.minimize(fit, guess, method='Nelder-Mead')
    else:
        fit_param = opt.minimize(fit, guess, method='L-BFGS-B', bounds=bounds)

    err = (fit_param.success, fit_param.message)

    return (create_params(fixed_params, fit_param.x), err)


def get_fit_data(days, data_original, end_discard=3, last_n_points=None):
    """
    Select the relevant part of the data for the fitting procedure. The early datapoints where there is less
    than 20 cases are removed. The last 3 days are also removed (due to latency of reporting)
    """
    data = copy.deepcopy(data_original)
    day0 = days[-last_n_points] if last_n_points else days[0]

    # Filter points
    good_idx = np.bitwise_and(days >= day0, days < days[-1] - end_discard)
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

    # start the model 2 weeks prior.
    time = np.concatenate(([day0-14], days[good_idx]))
    return time, data


def fit_population_iterative(key, time_points, data, guess=None):
    """
    Iterative fitting procedure. First, R_effective is estimated from the data and fitted using a stair
    function to deduce R0, the containment start date and the efficacy of the containement. Secondly, these
    parameters are used to optimize the reported fraction and the initial number of infected people using the
    fit_params function.
    """
    if data is None or data[Sub.D] is None or len(data[Sub.D]) <= 14:
        return None

    res = get_Re_guess(time_points, data, only_deaths=FRA)
    fit = res['fit']

    if fit is None or fit[0]<1 or fit[0]>6 or fit[1]>fit[0] or fit[1]<0:
        return None

    fixed_params = {}
    fixed_params['logR0'] = np.log(fit[0])
    fixed_params['efficacy'] = 1-fit[1]/fit[0]
    fixed_params['containment_start'] = fit[2]

    if guess is None:
        guess = { "reported" : 0.1,
                  "logInitial" : 1,
                }
    bounds=None

    for ii in [Sub.T, Sub.D]:
        if not is_cumulative(data[ii]):
            print("Cases / deaths count is not cumulative.", data[ii])

    t1 = datetime.now().timestamp()
    param, err = fit_params(time_points, data, guess, fixed_params, bounds=bounds)
    t2 = datetime.now().timestamp()

    tMin = datetime.strftime(datetime.fromordinal(time_points[0]), '%Y-%m-%d')
    res = {'params': param, 'tMin': tMin, 'data': data, 'error':err}
    if param.containment_start is not None:
        res['containment_start'] = datetime.fromordinal(int(param.containment_start)).strftime('%Y-%m-%d')

    print(key, fixed_params, ", reported:", param.reported, ", Initial cases", np.exp(param.logInitial))
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
    from scripts.load_utils import get_case_data

    parser = argparse.ArgumentParser(description = "",
                                    usage="fit data")

    parser.add_argument('--key', type=str, help="key for region, e.g 'USA-California'")
    args = parser.parse_args()

    CASE_DATA = get_case_data()
    days, data = load_data(CASE_DATA['Switzerland'])

