# Updates to the model

The SARS-CoV-2 is a novel virus and we are learning more about the virus every day.
Scientists around the world are studying how the virus spreads and how it affects people of different age, sex, or those with pre-existing conditions.
Dozens of scientific papers are published every day.

As we learn more about the virus, we try to update our model and the parameters.
However, updates to the model will mean that a run of the model from last week might give slighly different results from a run now.
These differences arise for two types of reasons

 * We changed the default parameters because we think they more accurately reflect what we know about the virus. In this case, reverting to old parameters should give the same results.
 * We changed the underlying model to be more realistic or because there were some bugs or inaccuracies. In this case, even the same parameters will not necessarily give the same results

We realize this can be confusing, but in this evolving situation, this is difficult to avoid.
We try to summarize most significant model changes below.


## 2020-03-26: Modification of the model to allow for more realistic latency distributions

In this update, we replaced the single exposed category with a sequence of three exposed categories.
The single category implicitly assumes that individuals spend an exponentially distributed time in the "exposed but not yet infectious" state.
The peak of the exponential distribution is at zero implying that many individuals spend a very short time in this category while other spend a much longer time.
In reality, it will take at least 2-3 days before the virus has grown to sufficient numbers before somebody is infectious.
Multiple exposed categories effectively generate an [Erlang distribution](https://en.wikipedia.org/wiki/Erlang_distribution) (a special case of a Gamma distribution) with a peak away from zero.

## 2020-03-18: Take available hospital beds into account

Early version of our model used the number of available hospital beds only as a guide to the eye -- exceeding the ICU capacity did not results in an increased fatality rate.
We changed this by adding an additional category "overflow" which models patients that are critically ill but don't get the treatment they need because no ICUs are available.
These individuals die at an increased rate.
In the allocation algorithms, younger individuals are given priority.



