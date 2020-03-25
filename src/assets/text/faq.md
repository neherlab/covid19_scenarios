# Frequently asked questions

**Q:** Why does the outbreak grow more slowly when I increase the infectious period?

**A:** _The number of secondary cases a particular case causes is specified by R0. If you increase the infectious
period, the same number of infections happen over a longer period. Hence the outbreak grows more slowly._

---

**Q:** Why is the number of severe cases lower than the number of critical cases?

**A:** _COVID19 cases in critical condition need intensive care for a long time. Our model assumes that they spend on
average 14days in the ICU. The severly ill (our proxy for those in need of a regular hospital bed) either deteriorate
fast or recovery (default in our model is four days). Hence at any given point in time, the number of critically ill
people might exceed the number of severly ill._

---

**Q:** Is the model fit to observations?

**A:** _No, currently we don't fit the model to observations. This is planned and we hopefully get it done soon.
Instead, we use epidemiological parameters estimated from data from China and guess the initial size of the COVID19
outbreak in different populations._

---

**Q:** My country/region/town is missing!

**A:** _If you have suggestions on additional regions that should be covered, head over to
https://github.com/neherlab/covid19_scenarios_data and make a PR!_

---

**Q:** What is ICU overflow?

**A:** _In places that have seen severe COVID19 outbreak, the capacity of intensive care facilities is quickly
exhausted. Patients that need ventilation but can't get ventilation due to shortage will die faster. "ICU overflow" is
our label for critically ill patients that should be ventilated but are not since no ventilators are available. These
patients will die faster. The degree to which they die faster is specified by the `Severity of ICU overflow` parameter._

---

**Q:** Wouldn't it be a good idea to model isolation of specific age-groups?

**A:** _Yes! This is indeed possible on covid-scenarios. Expand the card
`Severity assumptions and age-specific isolation`. The last column allows you to specify the to what extent individual
age groups are isolated from the rest of the population._

---

**Q:** How does your model compare to the one by Imperial College London?

**A:** _You are probably referring to the
[March 16 report by Neil Ferguson et al](https://www.imperial.ac.uk/media/imperial-college/medicine/sph/ide/gida-fellowships/Imperial-College-COVID19-NPI-modelling-16-03-2020.pdf).
Like us, Ferguson et al model the effect of interventions on the spread of COVID19 using a computational model.
Their model is individual based, meaning their program represents a large number of individuals among which
the virus is spreading. Our model is breaks the population into age-groups and different categories corresponding
to susceptible, infected, dead, recovered, etc. This allows for faster simulations, but looses some realism.
The faster simulation allows exploration of parameters._
