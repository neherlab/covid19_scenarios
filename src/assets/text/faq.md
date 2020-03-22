# Fequently asked questions


Q: Why does the outbreak grow more slowly when I increase the infectious period?

A: The number of secondary cases a particular case causes is specified by R0. If you increase the infectious period, the same number of infections happen over a longer period. Hence the outbreak grows more slowly.


Q: Why is the number of severe cases lower than the number of critical cases?

A: COVID19 cases in critical condition need intensive care for a long time. Our model assumes that they spend on average 14days in the ICU. The severly ill (our proxy for those in need of a regular hospital bed) either deteriorate fast or recovery (default in our model is four days). Hence at any given point in time, the number of critically ill people might exceed the number of severly ill.


Q: Is the model fit to observations?

A: No, currently we don't fit the model to observations. This is planned and we hopefully get it done soon. Instead, we use epidemiological parameters estimated from data from China and guess the initial size of the COVID19 outbreak in different populations.

Q: My country/region/town is missing!

A: If you have suggestions on additional regions that should be covered, head over to https://github.com/neherlab/covid19_scenarios_data and make a PR!
