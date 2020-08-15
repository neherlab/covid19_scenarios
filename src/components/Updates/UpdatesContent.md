SARS-CoV-2 is a novel virus, and everyday we learn more about its virulence. Scientists around the world are
studying how the virus spreads and how it affects people of different age, sex, or those with pre-existing conditions.
Dozens of scientific papers are published on these subjects daily.

As we learn more about the virus, we try to update our model and parameters. However, model updates will mean
that a run from last week may give slightly different results than a run now. These differences arise for
two types of reasons:

- We have changed the default parameters because we think they more accurately reflect what we now know about the virus. In this
  case, reverting to old parameters should give the same results.
- We have changed the underlying model to be more realistic, or because there were some bugs or inaccuracies. In this case,
  even the same parameters will not necessarily give the same results.

We realize this can be confusing, but in this evolving situation, changes are difficult to avoid. At this time, updates to our model are necessary to maintain an accurate representation of the virual situation. To help you, we include summaries of our most significant model changes, as shown below.


### 2020-07-24: Added palliative flux to severity distribution
Palliative flux is a transition when patients move from "severe" to "death," _without_ going to critical care. It represents cases of death directly from regular hospital ward or nursing home. In principle this is an age-dependent parameter, so we have created a new column on the age specific severity distribution table to represent this percentage. To use, expand the `Age-Group-Specific Parameters` card and set this along with other parameters for each age group. Note the sum of palliative and critical percentage cannot exceed 100%. Due to this modification the schema version was upgraded from 2.0.0 to 2.1.0, which allows old versions of json files holding parameters to continue working on this new version.



### 2020-06-14: Default plots now include weekly cases and deaths
Most locations have a pronounced weekly variation in case and fatality counts for administrative rather than epidemiological reasons. Therefore, 
we have decided to plot case counts and deaths as a _rolling average_ over the last seven days, resulting in much smoother trajectories.
To align with this change of presented observations, the model also shows weekly deaths instead of cumulative deaths.
The latter are still available but not enabled by default.
To enable these curves, click on grayed out items in the plot legend.


### 2020-06-14: Median curve is now deterministic

Several users have been surprised that run to run the median curve is quite variable, despite the parameter inputs
being deterministic. The underlying reason for this behavior is linked to sample size. The app samples parameters from the parameter ranges
and plots the median of this--often small--sample. Since these parameters affect exponential growth, small variation in
the sample can result in large variation in the output. We now generate an additional trajectory where each
parameter is set to its median value. This new trajectory is plotted instead of the sample median and should behave like the median trajectory in a large sample.

### 2020-06-09: Bugfix in mitigation interval sampling
Our simulations include parameter uncertainty by sampling parameters from user-specified ranges.
For somewhat subtle reasons, this sampling procedure behaved differently in the production and the development
environment. This resulted in using only one realization of the mitigation parameters.
To correct this issue patch [729](https://github.com/neherlab/covid19_scenarios/pull/729/commits/35ba172229c944fa0b88efbd1e112ecdcd71e97f) was released.
As a result, you should expect that the confidence intervals increased, while the jumpiness from one realization to another
should be reduced.


### 2020-05-22: Changes to the parameter presets

Our parameter presets for $R_0$, the initial number of cases, and interventions are designed to allow you to adjust a
scenario to the developments in your community. They are not sophisticated inferences--this would
require dedicated procedures for different regions each with their own peculiarities in reporting.
But as more data becomes available we can estimate more parameters directly, which should result in better
starting points.

We now estimate the initial $R_0$, the Re in the last three weeks of available data, and time point at which the $R_0$ changed.
Together with estimates of the initial number of cases, robust data results in fits that track data for communities fairly well. We hope this facilitates further manual optimization.


### 2020-04-29: Allow for parameter uncertainty

Since release 1.2.0, parameters that affect the growth rate ($R_0$ and the mitigation efficacy) are specified as ranges.
Simulation results are very sensitive to these parameters and we wanted to make this clear. Instead of one number, the
user now has to specify two numbers that indicate the plausible lower and upper values of the parameter. The model will
then randomly sample a number of combinations of the parameters, each uniformly from the range and run multiple
simulations. The results graph shows the median and a shaded area indicating the 20th and 80th percentile. By setting
upper and lower ranges of a parameter to the same value, the simulation will revert back to its previous version.

### 2020-04-06: Scenario parameters estimated from data

We have started to fit a few individualized parameters for scenarios based upon COVID-19 case data (provided we have
access to a trusted source updated daily). Currently the estimated parameters are $R_0$, the initial time of the epidemic,
and the fraction of infections sampled by the region. If you don't find your region of interest in the list, please
visit our [Github](https://github.com/neherlab/covid19_scenarios/tree/master/data) to find details about how to
contribute!

### 2020-04-02: Reduce latency time

Our initial model assumed a serial interval (time between subsequent infections) of 7-8 days based on research published
by [Li et al](https://doi.org/10.1056/NEJMoa2001316). This was split in a latency of 5 days and an infectious period of
3 days. More recent research by [Ganyani et al.](https://www.medrxiv.org/content/10.1101/2020.03.05.20031815v1) suggests that 
the serial interval might be closer to 5-6 days. This change will result in smaller $R_0$ estimates for the same
doubling time. This is good news because a smaller $R_0$ implies that infection control measures are more effective!

### 2020-03-30: Decrease integration time step

Our previous code stepped the ODE forward in 6h intervals. This large step size resulted in inaccuracies, particularly
as we were using a first order integration scheme. This step size is now reduced to 0.05 days. Please note, this can change the output
of the model by a few percent. We will soon move to a higher order integration scheme for more accurate ODE integration.

### 2020-03-26: Modification of the model to allow for more realistic latency distributions

In this update, we replaced the single exposed category with a sequence of three exposed categories. The single category
implicitly assumes that individuals spend an exponentially distributed time in the "exposed but not yet infectious"
state. The peak of the exponential distribution is at zero, which implies that many individuals spend a very short time in
this category while others spend a much longer time. In reality it will take at least 2-3 days before the virus has
grown to sufficient enough numbers to cause somebody to be infectious. Multiple exposed categories effectively generate an
[Erlang distribution](https://en.wikipedia.org/wiki/Erlang_distribution) (a special case of a Gamma distribution) with a
peak away from zero.

### 2020-03-18: Take available hospital beds into account

The early version of our model used the number of available hospital beds only as a guide to the eye; that is, exceeding the ICU
capacity did not result in an increased fatality rate. We changed this by adding an additional category labelled "overflow."
This models patients who are critically ill but do not get the treatment they require because no ICUs are available. These
individuals die at an increased rate. Note, in the allocation algorithms, younger individuals are given priority.
