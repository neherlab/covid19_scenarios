import numpy as np
from matplotlib import pyplot as plt
import sys
sys.path.append('..')
from datetime import datetime
from scipy.signal import savgol_filter
from scipy import optimize
from enum import IntEnum
import copy

compartments = ['S', 'E1', 'E2', 'E3', 'I', 'H', 'C', 'D', 'R', 'T', 'NUM']
Sub = IntEnum('Sub', compartments, start=0)

def empty_data_list():
    return [np.array([]) if (i == Sub.D or i == Sub.T or i == Sub.H or i == Sub.C) else None for i in range(Sub.NUM)]

def smooth(data):
    # Uses a savgol_filter over the data ignoring the nan values. Just doing the fit removes each point where
    # a nan is found in the fiting window, thus removing a lot of points.
    smoothed = copy.deepcopy(data)
    for ii in [Sub.T, Sub.D, Sub.H, Sub.C]:
        if smoothed[ii] is not None:
            np.put(smoothed[ii], np.array(range(len(smoothed[ii])))[~np.isnan(smoothed[ii])],
                    savgol_filter(smoothed[ii][~np.isnan(smoothed[ii])], 9, 3, mode="mirror"))
    return smoothed

def growth_rate_to_R0(data, serial_interval=6):
    R0_by_day = empty_data_list()
    for ii in [Sub.T, Sub.D, Sub.H, Sub.C]:
        if data[ii] is not None:
            R0_by_day[ii] = 1+serial_interval*data[ii]
            R0_by_day[ii].mask = np.isnan(R0_by_day[ii])
        else:
            R0_by_day[ii] = None
    return R0_by_day

def get_daily_counts(data):
    diff_data = empty_data_list()
    for ii in [Sub.T, Sub.D, Sub.H, Sub.C]:
        if data[ii] is not None:
            diff_data[ii] = np.ma.array(np.concatenate(([np.nan],np.diff(data[ii]))))
            diff_data[ii][diff_data[ii]==0] = np.nan
            diff_data[ii].mask = np.isnan(diff_data[ii])
        else:
            diff_data[ii] = None
    return diff_data

def get_growth_rate(data, step=7):
    log_diff = empty_data_list()
    for ii in [Sub.T, Sub.D, Sub.H, Sub.C]:
        if data[ii] is not None:
            log_diff[ii] = (np.log(data[ii][step:]) - np.log(data[ii][:-step]))/step
            log_diff[ii] = np.concatenate((log_diff[ii], np.repeat(np.nan, step)))
        else:
            log_diff[ii] = None
    return log_diff

def stair_func(time, val_o, val_e, x_drop):
    return np.array([val_o if t <= x_drop else val_e for t in time])

def err_function(x_drop, time, vec, val_o, val_e):
    # vec need to be masked to avoid nan
    return np.sum(np.abs(vec - stair_func(time, val_o, val_e, x_drop))**1)

def stair_fit(time, vec, guess=None, nb_value=3):
    val_o = np.mean(vec[~vec.mask][:nb_value])
    val_e = np.mean(vec[~vec.mask][-nb_value:])
    drop = time[np.argmin([err_function(x, time, vec, val_o, val_e) for x in time])]
    return val_o, val_e, drop

def get_Re_guess(time, cases, step=7, extremal_points=7, death_data=False):
    #R_effective
    diff_data = get_daily_counts(cases)
    growth_rate = get_growth_rate(diff_data, step)
    R0_by_day = growth_rate_to_R0(growth_rate)
    return {"fit": stair_fit(time, R0_by_day[Sub.D if death_data else Sub.T], nb_value=extremal_points),
            "R0_by_day": R0_by_day,
            "R0_smoothed": smooth(R0_by_day)}


if __name__ == "__main__":
    from scripts import tsv
    from scripts.model import load_data
    case_counts = tsv.parse()

    step = 7
    smoothing = 4
    country_list = ["Switzerland"]
    # country_list = ["Germany", "Switzerland", "Italy"]
    # country_list = ["United States of America", "USA-New York", "USA-California", "USA-New Jersey", "Germany", "Italy"]

    for ci, c in enumerate(country_list):
        time, data = load_data(c, case_counts[c])
        res = get_Re_guess(time, data, extremal_points=10, death_data=False)
        fit = res["fit"]
        R0_by_day = res["R0_by_day"]
        R0_smoothed = res["R0_smoothed"]
        dates = [datetime.fromordinal(x) for x in time]

        plt.figure(1)
        # plt.plot(t_smoothed, R0_cases_smoothed, label=c, ls='--', c=f"C{ci}")
        plt.plot(dates, R0_by_day[Sub.T], '--', label=f"{c}", c=f"C{ci}")
        plt.plot(dates, R0_smoothed[Sub.T], c=f"C{ci}")
        plt.plot(dates, stair_func(time, *fit), c=f"C{ci}")
        # plt.figure(2)
        # plt.plot(t_smoothed, R0_deaths_smoothed, label=c)

    # for i,n in [(1,"cases"), (2, 'deaths')]:
    #     plt.figure(i)
    #     plt.title("Naive R0 estimate from smoothed new case reports 7 days apart")
    #     plt.xlim(time[-40] if len(time)>40 else time[0], time[-1])
    #     plt.plot(time, np.ones_like(time))
    #     plt.ylabel("R0 estimate")
    #     plt.legend(loc=3)
    #     # plt.ylim(0,3.5)
    #     # plt.savefig(f"{n}.png")4
    plt.xlabel("R0")
    plt.ylabel("Time [days]")
    plt.legend(loc="best")
    plt.savefig("Stair_fit", format="png")
    plt.show()
