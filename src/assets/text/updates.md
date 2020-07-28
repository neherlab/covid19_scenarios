The SARS-CoV-2 is a novel virus and we are learning more about the virus every day. Scientists around the world are
studying how the virus spreads and how it affects people of different age, sex, or those with pre-existing conditions.
Dozens of scientific papers are published every day.

As we learn more about the virus, we try to update our model and the parameters. However, updates to the model will mean
that a run of the model from last week might give slightly different results from a run now. These differences arise for
two types of reasons

- We changed the default parameters because we think they more accurately reflect what we know about the virus. In this
  case, reverting to old parameters should give the same results.
- We changed the underlying model to be more realistic or because there were some bugs or inaccuracies. In this case,
  even the same parameters will not necessarily give the same results

We realize this can be confusing, but in this evolving situation, this is difficult to avoid. We try to summarize the
most significant model changes below.


### 2020-07-24: Added palliative flux to severity distribution
Palliative flux is a transition when patients move from severe to death, without going to critical care. It represents cases of death straight from hospital regular ward (or nursing home). This in principle an age dependent parameter so we have created a new column on age specific severity distribution table to represent this percentage. Click on the severity distribution table and set this along other parameters for each age group. The sum of palliative and critical percentage can't exceed 100%. Due to this modification schema version was upgraded from 2.0.0 to 2.1.0 allowing old versions of json files holding parameters to keep working on this new version.



### 2020-06-14: Default plots are now include weekly cases and deaths
Most locations have a pronounced weekly variation of case and fatality counts which have administrative rather than epidemiological reasons.
We therefore decided to plot case counts and deaths as a rolling average over the last seven days, resulting in much smoother trajectories.
To align with this change of presented the observations, we also show weekly deaths of the model instead of cumulative deaths.
The latter are still available but not enabled by default.
Click on grayed out items in the plot legend to enable these curves.


### 2020-06-14: Median curve is now deterministic

Several users were surprised that the median curve is quite variable from run to run despite the parameter inputs
being deterministic. The underlying reason for this behavior is that the app samples parameters from the parameter ranges
and plots the median of this often small sample. Since these parameters affect exponential growth, small variation in
the sample can result in large variation in the output. We now generate an additional trajectory where each
parameter is set to its median value. This trajectory should behave like the median trajectory in a large sample
and is plotted instead of the sample median.

### 2020-06-09: Bugfix in mitigationInterval sampling.
Our simulations include parameter uncertainty by sampling parameters from user-specified ranges.
For somewhat subtle reasons, this sampling procedure behaved differently in the production and the development
environment which result in using only one realization of the mitigation parameters.
This was patched in [commit](https://github.com/neherlab/covid19_scenarios/pull/729/commits/35ba172229c944fa0b88efbd1e112ecdcd71e97f).
As a result, you should expect that the confidence intervals increased, while the jumpiness from one realization to another
should be reduced.


### 2020-05-22: Changes to the parameter presets

Our parameter presets for R0, the initial number of cases, and interventions are meant to facilitate adjusting a
scenario to the developments in your community. They are not sophisticated inferences -- this would
require dedicated procedures for different regions that each come with their own peculiarities in reporting.
But with more data available, we can estimate more parameters directly from data that should result in better
starting points.

We now estimate the initial R0, the Re in the last three weeks of available data, and time point at which the R0 changed.
Together with estimates of the initial number of cases, the resulting fits track data for communities with
robust data fairly well. We hope this facilitates further manual optimization.


### 2020-04-29: Allow for parameter uncertainty

Since release 1.2.0, parameters that affect the growth rate (R0 and the mitigation efficacy) are specified as ranges.
Simulation results are very sensitive to these parameters and we wanted to make this clear. Instead of one number, the
user now has to specify two numbers that indicate the plausible lower and upper values of the parameter. The model will
then randomly sample a number of combinations of the parameters, each uniformly from the range and run multiple
simulations. The results graph show the median and a shaded area indicating the 20th and 80th percentile. By setting
upper and lower ranges of a parameter to the same value, the simulation will revert back to its previous version.

### 2020-04-06: Scenario parameters estimated from data

We have begun fitting a few individualized parameters for scenarios based upon COVID-19 case data provided we have
access to a trusted source updated daily. Currently the estimated parameters are R0, the initial time of the epidemic,
and the fraction of infections sampled by the region. If you don't find your region of interest in the list, please
visit our [Github](https://github.com/neherlab/covid19_scenarios/tree/master/data) to find details about how to
contribute!

### 2020-04-02: Reduce latency time

Our initial model assumed a serial interval (time between subsequent infections) of 7-8 days based on research published
by [Li et al ](https://doi.org/10.1056/NEJMoa2001316). This was split in a latency of 5 days and an infectious period of
3 days. More recent research by [Ganyani et al](https://www.medrxiv.org/content/10.1101/2020.03.05.20031815v1) suggests
the serial interval might be closer to 5-6 days. This change will result in smaller estimates for R0 for the same
doubling time. A smaller R0 implies that infection control measures are more effective, so this is good news!

### 2020-03-30: Decrease integration time step

Our previous code stepped the ODE forward in 6h intervals. This large step size results in inaccuracies, in particular
as we are using first order integration scheme. This step size is now reduced to 0.05 days. This can change the output
of the model by a few percent. We will soon move to a higher order integration scheme for more accurate ODE integration.

### 2020-03-26: Modification of the model to allow for more realistic latency distributions

In this update, we replaced the single exposed category with a sequence of three exposed categories. The single category
implicitly assumes that individuals spend an exponentially distributed time in the "exposed but not yet infectious"
state. The peak of the exponential distribution is at zero implying that many individuals spend a very short time in
this category while others spend a much longer time. In reality, it will take at least 2-3 days before the virus has
grown to sufficient numbers before somebody is infectious. Multiple exposed categories effectively generate an
[Erlang distribution](https://en.wikipedia.org/wiki/Erlang_distribution) (a special case of a Gamma distribution) with a
peak away from zero.

### 2020-03-18: Take available hospital beds into account

Early version of our model used the number of available hospital beds only as a guide to the eye -- exceeding the ICU
capacity did not results in an increased fatality rate. We changed this by adding an additional category "overflow"
which models patients that are critically ill but don't get the treatment they need because no ICUs are available. These
individuals die at an increased rate. In the allocation algorithms, younger individuals are given priority.
