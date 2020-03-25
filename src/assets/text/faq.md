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
