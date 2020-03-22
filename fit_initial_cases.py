import numpy as np
import json
from datetime import datetime
from scipy.stats import linregress

doubling_time = 3.0
fixed_slope = np.log(2)/doubling_time
march1st = datetime(2020,3,1).toordinal()
under_reporting = 5
delay = 18

def fit_cumulative_trajectory(t, y):
    good_ind = (y>3)&(y<500)
    t_subset = t[good_ind]
    logy_subset = np.log(y[good_ind])
    if good_ind.sum()>10:
        res = linregress(t_subset, logy_subset)
        return {"intercept": res.intercept, "slope":res.slope, 'rvalue':res.rvalue}
    elif good_ind.sum()>4:
        intercept = logy_subset.mean() - t_subset.mean()*fixed_slope
        return {"intercept": intercept, "slope":1.0*fixed_slope, 'rvalue':np.nan}
    else:
        return None

def fit_population(pop):
    data_array = []
    for dp in pop:
        data_array.append([datetime.strptime(dp['time'], "%Y-%m-%d").toordinal(),
                           dp['cases'] or np.nan, dp['deaths'] or np.nan])

    data_array = np.array(data_array)
    fit_on_deaths = fit_cumulative_trajectory(data_array[:,0], data_array[:,2])
    print(fit_on_deaths)
    if fit_on_deaths:
        val_on_march1st = np.exp(delay*fit_on_deaths["slope"])*np.exp(march1st*fit_on_deaths["slope"] + fit_on_deaths["intercept"])
        return val_on_march1st
    else:
        fit_on_cases = fit_cumulative_trajectory(data_array[:,0], data_array[:,1])
        if fit_on_cases:
            val_on_march1st = under_reporting*np.exp(march1st*fit_on_cases["slope"] + fit_on_cases["intercept"])
            return val_on_march1st
        else:
            return None

if __name__ == '__main__':
    with open("case-counts/case_counts.json") as fh:
        case_counts = json.load(fh)

    for pop in case_counts:
        if pop[:3]=='ITA':
            initialCases = fit_population(case_counts[pop])
            if initialCases:
                print(pop, initialCases)
