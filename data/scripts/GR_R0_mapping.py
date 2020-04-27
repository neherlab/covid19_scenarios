import sys
import numpy as np
import copy
import matplotlib.pyplot as plt
sys.path.append('..')
from model import POPDATA, AGES, Sub, DefaultRates, solve_ode, trace_ages, Params, Fracs, init_pop
from R0_estimator import get_growth_rate, empty_data_list


def run_model(R0, nb_time_pts=50, initialCases=20, key="USA-California"):
    time_points = np.arange(-21,nb_time_pts-21)
    rates = copy.deepcopy(DefaultRates)
    rates.logR0 = np.log(R0)
    rates.infectivity = np.exp(rates.logR0) * rates.infection
    params = Params(ages=AGES[POPDATA[key]["ageDistribution"]], size=POPDATA[key]["size"],
                    times=time_points, date=nb_time_pts, rates=rates, fracs=Fracs())

    model = trace_ages(solve_ode(params, init_pop(params.ages, params.size, initialCases)))
    model = np.swapaxes(model, 0, 1)
    return time_points, model


if __name__ == "__main__":
    growth_rate_step = 7

    plt.figure(1)
    plt.title(f"Model cases")
    plt.figure(2)
    plt.title(f"Growth rate step {growth_rate_step}")
    for R0 in [1.1, 1.2, 1.4, 2, 3, 4]:
        time_points, model = run_model(R0)
        growth_rate_data = empty_data_list()
        for ii in [Sub.T, Sub.D]:
            growth_rate_data[ii] = model[ii]
        growth_rate = get_growth_rate(growth_rate_data, growth_rate_step)

        plt.figure(1)
        plt.plot(time_points, model[Sub.T], label=f"R0 = {R0}")

        plt.figure(2)
        plt.plot(time_points, growth_rate[Sub.T], label=f"R0 = {R0}")

    plt.figure(1)
    plt.yscale("log")
    plt.legend()
    plt.grid()
    # plt.savefig("Model cases", format="png")

    plt.figure(2)
    plt.legend()
    plt.grid()
    # plt.savefig("Growth rate", format="png")

    plt.show()
