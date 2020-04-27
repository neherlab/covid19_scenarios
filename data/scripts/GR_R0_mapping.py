import sys
import numpy as np
import matplotlib.pyplot as plt
sys.path.append('..')
from model import POPDATA, AGES, Sub, DefaultRates, solve_ode, trace_ages, Params, Fracs, init_pop
from R0_estimator import get_growth_rate


def run_model(R0, nb_time_pts=50, initialCases=20, key="USA-California"):
    time_points = np.arange(-21,nb_time_pts-21)
    rates = DefaultRates
    rates.logR0 = np.log(R0)
    params = Params(ages=AGES[POPDATA[key]["ageDistribution"]], size=POPDATA[key]["size"],
                    times=time_points, date=nb_time_pts, rates=rates, fracs=Fracs())
    model = trace_ages(solve_ode(params, init_pop(params.ages, params.size, initialCases)))
    model = np.swapaxes(model, 0, 1)
    return time_points, model


if __name__ == "__main__":
    for R0 in [1.1, 1.2, 1.4, 2, 3, 4]:
        time_points, model = run_model(R0)
        plt.figure()
        plt.title(f"R_0 = {R0}")
        plt.plot(time_points, model[Sub.T], label="cases")
        plt.plot(time_points, model[Sub.D], label="deaths")
        plt.legend()
        plt.yscale("log")
        plt.show()
