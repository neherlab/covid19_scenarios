import numpy as np
from datetime import datetime
from scipy.stats import poisson, scoreatpercentile
from scripts.model import Sub

# incubation: mean = 5.3, sd =3.2 (Linton et al., best gamma distr fit)
mean_incubation = 5.3
sd_incubation = 3.2

# onset to test: pooled CH data from BAG (12/05/20 update)
mean_onset_to_test = 4
sd_onset_to_test = 4

def gamma(x, m, std):
    tau = std**2/m
    k = m/tau
    res = x**(k-1)*np.exp(-x/tau)
    return res/res.sum()


def get_weekday_effect(new_cases):
    weekly_effect = new_cases[:]/(np.convolve(np.ones(7)/7, new_cases[:], mode='same')+1)
    weeks = weekly_effect.shape[0]//7
    by_week = weekly_effect[:weeks*7].reshape(weeks, 7)
    avg_week_day_effect = by_week.mean(axis=0)
    avg_week_day_effect/=avg_week_day_effect.mean()
    return avg_week_day_effect[np.arange(new_cases.shape[0])%7]

def get_onset_delay(size, m, std):
    t = np.arange(size)
    return gamma(t, m, std)

def get_infectious_time(size, m, std):
    t = np.arange(size)
    return gamma(t, m, std)

def get_reporting_delay(size, m, std):
    t = np.arange(size)
    return gamma(t, m, std)

def get_matrix(dis, size):
    matrix = np.zeros(size, dtype=float)
    for ri,row in enumerate(matrix):
        if ri<len(row):
            row[:ri+1] = dis[:ri+1][::-1]
        else:
            d = ri - len(row) + 1
            row[:] = dis[d:d+len(row)][::-1]

    return matrix

def get_convolution_matrix(onset_delay, reporting_delay, size, add_week_averaging=True):

    onset_matrix = get_matrix(onset_delay, size)

    reporting_matrix = get_matrix(reporting_delay, (size[0], size[0]))

    delay_matrix = reporting_matrix.dot(onset_matrix)

    if add_week_averaging:
        week_averaging_matrix = np.zeros((size[0], size[0]), dtype=float)
        for ri,row in enumerate(week_averaging_matrix):
            row[max(0,ri-7):ri] = 1/7

        return week_averaging_matrix.dot(delay_matrix)
    else:
        return delay_matrix

def solve_for_incidence(cases, convolution_matrix, week_day_vector=None, ax=None, n_iter=10, days=None, initial_shift = 5):
    incidence = np.ones(convolution_matrix.shape[1])*cases[-1]
    incidence[:-initial_shift] = cases[-(len(incidence)-initial_shift):]
    if week_day_vector is None:
        week_day_vector = np.ones(convolution_matrix.shape[0])

    if ax:
        ax.plot(days[:len(cases)], cases, c='C1', lw=4, label='Case counts')
        ax.plot(days[:len(incidence)], incidence, c=Reds(0.3))
    eps=1
    for i in range(0,n_iter):
        expectation = (eps + convolution_matrix.dot(incidence))
        incidence = incidence/(week_day_vector.dot(convolution_matrix)+eps) * ((cases/expectation).dot(convolution_matrix)+eps)
        if ax:
            ax.plot(days[:len(incidence)], incidence, c=Reds((i+4)/14), label = f"iteration {i}" if i%2 else '')
            ax.plot(days[:len(week_day_vector)], week_day_vector*convolution_matrix.dot(incidence), c=Blues((i+1)/14))

    return incidence

def get_Re(incidence, imports=5, m=5, std=3, incidence_err = None):
    infection_delay = get_infectious_time(len(incidence), m, std)
    infection_matrix = get_matrix(infection_delay, size=(incidence.shape[0], incidence.shape[0]))

    if incidence_err is not None:
        dLogRe = np.sqrt(incidence_err**2/incidence**2 + infection_matrix.dot(incidence_err**2/incidence**2))
        return incidence/infection_matrix.dot(incidence + imports), dLogRe
    else:
        return incidence/infection_matrix.dot(incidence + imports)


def estimate_Re(cases, imports=5, cutoff = 10, week_day_vector=None, chop=3):
    if chop==0:
        chop= -(len(cases) - cutoff)

    #week_day_vector = get_weekday_effect(cases)
    if week_day_vector is None:
        week_day_vector = np.ones_like(cases)

    reporting_delay = get_reporting_delay(len(cases), m=mean_onset_to_test, std=mean_onset_to_test)
    onset_delay = get_onset_delay(len(cases), m=mean_incubation, std=sd_incubation)

    convolution_matrix = get_convolution_matrix(onset_delay, reporting_delay,  (len(cases), len(cases)-cutoff), add_week_averaging=True)

    incidence = solve_for_incidence(cases, convolution_matrix, week_day_vector=week_day_vector)
    Re = get_Re(incidence, imports=imports)

    return {"Re":Re[:-chop], "incidence": incidence[:-chop], "fit": convolution_matrix.dot(incidence)}

if __name__=="__main__":
  pass
