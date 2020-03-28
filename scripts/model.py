from enum import IntEnum

import numpy as np
import scipy.integrate as solve
import scipy.optimize as opt
import matplotlib.pylab as plt

# ------------------------------------------------------------------------
# Globals

N    = 100000
AGES = np.ones(9) / 9

# ------------------------------------------------------------------------
# Indexing enums

compartments = ['S', 'E1', 'E2', 'E3', 'I', 'H', 'C', 'D', 'R', 'NUM']
Sub = IntEnum('Sub', compartments, start=0)

groups = ['_0', '_1', '_2', '_3', '_4', '_5', '_6', '_7', '_8', 'NUM']
Age = IntEnum('Age', groups , start=0)

# ------------------------------------------------------------------------
# Organizational classes

class Rates(object):
    def __init__(self, latency, R0, infection, hospital, critical, imports):
        self.latency     = latency
        self.infectivity = R0 * infection
        self.infection   = infection
        self.hospital    = hospital
        self.critical    = critical
        self.imports     = imports

# NOTE: Pulled from default severe table on neherlab.org/covid19
#       Keep in sync!
# TODO: Allow custom values?
class Fracs(object):
    confirmed = np.array([5, 5, 10, 15, 20, 25, 30, 40, 50]) / 100
    severe    = np.array([1, 3, 3, 3, 6, 10, 25, 35, 50]) / 100
    critical  = np.array([5, 10, 10, 15, 20, 25, 35, 45, 55]) / 100
    fatality  = np.array([30, 30, 30, 30, 30, 40, 40, 50, 50]) / 100

    recovery  = 1 - severe
    discharge = 1 - critical
    stabilize = 1 - fatality

class TimeRange(object):
    def __init__(self, start, end, delta=1):
        self.start = start
        self.end   = end
        self.delta = delta

class Params(object):
    def __init__(self, ages, rates, size, times):
        self.ages  = ages
        self.rates = rates
        self.fracs = Fracs()
        self.size  = size
        self.time  = times

# ------------------------------------------------------------------------
# Main functions

def at(i, j):
    return i + Sub.NUM*j

def make_evolve(params):
    # Equations for coupled ODEs
    def evolve(t, pop):
        dpop = np.zeros_like(pop)

        fracI = sum(pop[at(Sub.S, age)] for age in range(Age.NUM)) / params.size
        for age in range(Age.NUM):
            # Fluxes
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

def assess_model(params, data):
    model = solve_ode(params, init_pop(params.ages, params.size, 1))
    lsq   = 0
    for i, datum in enumerate(data):
        if datum is None:
            continue
        lsq += np.sum(np.power(model[:, i] - datum, 2))

    return lsq

def fit_params(data, guess):
    params_to_fit = {"beta": 0, "gamma": 1}

    def unpack(x):
        return np.array([guess[key] for key in params_to_fit.keys()])

    times = TimeRange(0, max(len(datum)-1 for datum in data))

    def fit(x):
        rates = Rates(x[params_to_fit["beta"]], x[params_to_fit["gamma"]])
        param = Params(AGES, rates, N, times)
        return assess_model(param, data)

    fit_param = opt.minimize(fit, unpack(guess), method='Nelder-Mead', tol=1e-3)

    return fit_param

if __name__ == "__main__":
    rates = Rates(latency=1/5, R0=3, infection=1/3, hospital=1/3, critical=1/14, imports=1)
    times = TimeRange(0, 100)
    param = Params(AGES, rates, N, times)

    model = solve_ode(param, init_pop(param.ages, param.size, 1))

    # guess = {"beta": 10, "gamma": 5}
    # fit   = fit_params(model, guess)
