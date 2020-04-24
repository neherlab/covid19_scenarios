import numpy as np
from matplotlib import pyplot as plt
import sys
sys.path.append('..')
sys.path.append('/home/valentin/Desktop/richardLab/covid19_scenarios/data')
from scripts import tsv
from model import load_data
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

def growth_rate_to_R0(data):
    R0_by_day = empty_data_list()
    for ii in [Sub.T, Sub.D, Sub.H, Sub.C]:
        if data[ii] is not None:
            R0_by_day[ii] = np.ma.array(1+6*data[ii])
            R0_by_day[ii].mask = np.isnan(R0_by_day[ii])
        else:
            R0_by_day[ii] = None
    return R0_by_day
    # return np.exp(6*vec)

def differences(data):
    diff_data = empty_data_list()
    for ii in [Sub.T, Sub.D, Sub.H, Sub.C]:
        if data[ii] is not None:
            diff_data[ii] = np.concatenate(([np.nan],np.diff(data[ii])))
            diff_data[ii][diff_data[ii]==0] = np.nan
        else:
            diff_data[ii] = None
    return diff_data

def log_diff(data, step):
    log_diff = empty_data_list()
    for ii in [Sub.T, Sub.D, Sub.H, Sub.C]:
        if data[ii] is not None:
            log_diff[ii] = (np.log(data[ii][step:]) - np.log(data[ii][:-step]))/step
            log_diff[ii] = np.concatenate((np.repeat(np.nan, step), log_diff[ii]))
        else:
            log_diff[ii] = None
    return log_diff

def stair_func(time, params):
    val_o, val_e, x_drop = params
    return np.array([val_o if t <= x_drop else val_e for t in time])

def err_function(params, time, vec):
    # vec need to be masked to avoid nan
    return np.sum(np.power(vec - stair_func(time, params),2))

def stair_fit(time, vec, guess=None):
    # time must be in ordinal
    if guess is None:
        nb_value = 3
        val_o = np.mean(vec[~vec.mask][:nb_value])
        val_e = np.mean(vec[~vec.mask][-nb_value:])
        x_drop = time[len(time)//2]
        guess = [val_o, val_e, x_drop]

    fit_params = optimize.minimize(err_function, guess, args=(time, vec), method="Nelder-Mead")
    return fit_params.x, guess



case_counts = tsv.parse()

step = 7
smoothing = 4
country_list = ["Switzerland"]
#country_list = ["Germany", "Switzerland", "Italy"]
# country_list = ["United States of America", "USA-New York", "USA-California", "USA-New Jersey", "Germany", "Italy"]

for c in country_list:

    time, data = load_data(c, case_counts[c])
    time -= time[0]
    diff_data = differences(data)
    log_diff_vec = log_diff(diff_data, step)
    R0_by_day = growth_rate_to_R0(log_diff_vec)
    R0_smoothed = smooth(R0_by_day)

    fit_params, original_params = stair_fit(time, R0_by_day[Sub.T])

    # log_cases = [x["gr_cases"] for x in logdiff]
    # t = [x['time'][0] for x in logdiff]
    # t_smoothed = [x['time'][0] for x in logdiff][smoothing//2:-smoothing//2+1]
    #
    # R0_cases_by_day = np.ma.array([growth_rate_to_R0(x['gr_cases']) for x in logdiff])
    # R0_cases_by_day.mask = R0_cases_by_day.mask = np.isinf(R0_cases_by_day)
    #
    # R0_deaths_by_day = np.ma.array([growth_rate_to_R0(x['gr_deaths']) for x in logdiff])
    # R0_deaths_by_day.mask = R0_deaths_by_day.mask = np.isinf(R0_deaths_by_day)
    #
    # R0_cases_smoothed =  np.ma.convolve(R0_cases_by_day,  np.ma.ones(smoothing)/smoothing, mode='valid')
    # R0_deaths_smoothed = np.ma.convolve(R0_deaths_by_day, np.ma.ones(smoothing)/smoothing, mode='valid')
    plt.figure(1)
    # plt.plot(t_smoothed, R0_cases_smoothed, label=c, ls='--', c=f"C{ci}")
    plt.plot(time, R0_by_day[Sub.T], label=f"{c}")
    plt.plot(time, R0_smoothed[Sub.T], label=f"smoothed")
    plt.plot(time, stair_func(time,original_params), label="Original")
    plt.plot(time, stair_func(time,fit_params), label="Optimized")
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
#     # plt.savefig(f"{n}.png")
plt.legend(loc="best")
plt.show()
