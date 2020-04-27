import sys
import numpy as np
import copy
import matplotlib.pyplot as plt
sys.path.append('..')
from model import POPDATA, AGES, Sub, DefaultRates, solve_ode, trace_ages, Params, Fracs, init_pop
from R0_estimator import get_daily_counts, get_growth_rate, empty_data_list

def run_model(R0, nb_time_pts=30, initialCases=1000, key="USA-California"):
    time_points = np.arange(-21,nb_time_pts-21)
    rates = copy.deepcopy(DefaultRates)
    rates.logR0 = np.log(R0)
    rates.infectivity = np.exp(rates.logR0) * rates.infection
    params = Params(ages=AGES[POPDATA[key]["ageDistribution"]], size=1e10,
                    times=time_points, date=nb_time_pts, rates=rates, fracs=Fracs())

    model = trace_ages(solve_ode(params, init_pop(params.ages, params.size, initialCases)))
    data_model = empty_data_list()
    data_model[Sub.T] = model[:,Sub.T]
    data_model[Sub.D] = model[:,Sub.D]
    return time_points, data_model

def map_R0_GR(R0s, growth_rate_step = 7):
    gr = []
    for R0 in R0s:
        time_points, model = run_model(R0)
        diff_model = get_daily_counts(model)
        growth_rate = get_growth_rate(diff_model, growth_rate_step)
        gr = gr + [growth_rate[Sub.T][-growth_rate_step-1]]
    return gr

if __name__ == "__main__":
    R0s = np.linspace(0.2,5,50)
    growth_rate_step = 7
    gr = map_R0_GR(R0s, growth_rate_step)
    print(np.round(gr, 5))

    plt.figure()
    plt.plot(R0s, gr, '.', label=f"gr_step={growth_rate_step}")
    plt.xlabel("R0")
    plt.ylabel("Growth rate")
    plt.grid()
    plt.title("Mapping R0 to model growth rate")
    # plt.savefig("R0_GR_mapping", format="png")

    # tp, model = run_model(5)
    # plt.figure()
    # plt.plot(tp, get_daily_counts(model)[Sub.T])
    # plt.yscale('log')

    plt.show()
