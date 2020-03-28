from enum import IntEnum

import numpy as np
import scipy.integrate as solve
import scipy.optimize as opt
import matplotlib.pylab as plt

# class Sub(IntEnum):
#     S  = 0
#     E1 = 1
#     E2 = 2
#     E3 = 3
#     I  = 4
#     H  = 5
#     C  = 6
#     D  = 7
#     R  = 8

# class Age(IntEnum):
#     _0 = 0
#     _1 = 1
#     _2 = 2
#     _3 = 3
#     _4 = 4
#     _5 = 5
#     _6 = 6
#     _7 = 7
#     _8 = 8

# ------------------------------------------------------------------------
# Globals

N = 100000

# ------------------------------------------------------------------------
# Indexing enums

sub = IntEnum('sub', ['S', 'I', 'R', 'NUM'], start=0)

# ------------------------------------------------------------------------
# Organizational classes

class Rates(object):
    def __init__(self, infectivity, recovery):
        self.infectivity = infectivity
        self.recovery    = recovery

class TimeRange(object):
    def __init__(self, start, end, delta=1):
        self.start = start
        self.end   = end
        self.delta = delta

class Params(object):
    def __init__(self, rates, size, times):
        self.rates = rates
        self.size  = size
        self.time  = times

# ------------------------------------------------------------------------
# Main functions

def make_evolve(rates, fracs, N):
    # Unpack arguments
    beta  = rates.infectivity
    gamma = rates.recovery

    # Equations for coupled ODEs
    def evolve(t, pop):
        dpop = np.zeros_like(pop)
        dpop[sub.S] = -beta*pop[sub.I]*pop[sub.S] / N
        dpop[sub.I] = +beta*pop[sub.I]*pop[sub.S] / N - gamma*pop[sub.I]
        dpop[sub.R] = +gamma*pop[sub.I]

        return dpop

    return evolve

def init_pop(size, cases):
    pop = np.zeros(sub.NUM)
    pop[sub.S] = size-cases
    pop[sub.I] = cases

    return pop

def solve_ode(params, init_pop):
    rates  = params.rates
    fracs  = None
    size   = params.size

    t_beg  = params.time.start
    t_end  = params.time.end
    dt     = params.time.delta
    num_tp = int((t_end - t_beg)/dt)

    evolve = make_evolve(rates, fracs, params.size)
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
    model = solve_ode(params, init_pop(params.size, 1))
    lsq   = 0
    for i, datum in enumerate(data):
        if datum is None:
            continue
        lsq += np.sqrt(np.sum(np.power(model[:, i] - datum, 2)))

    print(f"diff: {lsq}")
    return lsq

def fit_params(data, guess):
    params_to_fit = {"beta": 0, "gamma": 1}

    def unpack(x):
        return np.array([guess[key] for key in params_to_fit.keys()])

    times = TimeRange(0, 100)

    def fit(x):
        rates = Rates(x[params_to_fit["beta"]], x[params_to_fit["gamma"]])
        param = Params(rates, N, times)
        return assess_model(param, data)

    fit_param = opt.minimize(fit, unpack(guess), tol=1e-3)

    return fit_param

if __name__ == "__main__":
    rates = Rates(2, 1)
    times = TimeRange(0, 100)
    param = Params(rates, N, times)

    model = [x for x in solve_ode(param, init_pop(param.size, 1)).T]

    guess = {"beta": 4, "gamma": 2}
    fit   = fit_params(model, guess)
