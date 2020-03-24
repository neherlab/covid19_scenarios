# About COVID-19 Scenarios

This web application serves as a planning tool for COVID-19 outbreaks in communities across the world.
It implements a simple SIR (Susceptible-Infected-Recovered) model with additional categories for individuals exposed to the virus that are not yet infectious,
severely sick people in need of hospitalization, people in critical condition, and a fatal category.

The source code of this tool is freely available at [github.com/neherlab/covid19_scenarios](https://github.com/neherlab/covid19_scenarios) and we welcome contributions in any form: comments, suggestions, help with development. For example, you can:

 - ask a question or post a comment in the [General Discussion Thread](https://github.com/neherlab/covid19_scenarios/issues/18)

 - report a bug or propose an improvement by openning a [New Issue](https://github.com/neherlab/covid19_scenarios/issues/new/choose)

 - directly propose changes in code, documentation or data by [Forking](https://github.com/neherlab/covid19_scenarios/fork) our repository on GitHub, commiting changes to your new fork and opening a [Pull Request](https://github.com/neherlab/covid19_scenarios/fork), so that we could review and merge the changes.


## Basic assumptions

The model works as follows:

 - susceptible individuals are exposed/infected through contact with infectious individuals. Each infectious individual causes on average $R_0$ secondary infections while they are infectious.
Transmissibility of the virus could have seasonal variation which is parameterized with the parameter
"seasonal forcing" (amplitude) and "peak month" (month of most efficient transmission).

 - exposed individuals progress to a symptomatic/infectious state after an average latency

 - infectious individuals recover or progress to severe disease. The ratio of recovery to severe progression depends on age

 - severely sick individuals either recover or deteriorate and turn critical. Again, this depends on the age

 - critically ill individuals either return to regular hospital or die. Again, this depends on the age

The individual parameters of the model can be changed to allow exploration of different scenarios.

<figure className="figure w-100 text-center">
  <img src={'../assets/img/model_sketch.svg'} className="w-75 figure-img" alt="illustration of the model" />
  <figcaption className="figure-caption text-center">
    Figure 1. A schematic illustration of the underlying model. S corresponds to the 'susceptible' population,
    E is 'exposed', I is 'infectious', R 'recovered', H 'severe' (hospitalized), C 'critical' (ICU), and D are
    fatalities.
  </figcaption>
</figure>

COVID-19 is much more severe in the elderly and proportion of elderly in a community is therefore an important determinant of the overall burden on the health care system and the death toll. We collected age distributions for many countries from data provided by the UN and make those available as input parameters. Furthermore, we use data provided by the epidemiology group by the [Chinese CDC](http://weekly.chinacdc.cn/en/article/id/e53946e2-c6c4-41e9-9a9b-fea8db1a8f51) ([alternative link](https://web.archive.org/web/20200320025420/weekly.chinacdc.cn/en/article/id/e53946e2-c6c4-41e9-9a9b-fea8db1a8f51)) to estimate the fraction of severe and fatal cases by age group.

## Seasonality

Many respiratory viruses such as influenza, common cold viruses (including other coronaviruses) have a pronounced seasonal variation in incidence which is in part driven by climate variation through the year. We model this seasonal variation using a sinusoidal function with an annual period. This is a simplistic way to capture seasonality. Furthermore, we don't know yet how seasonality will affect COVID-19 transmission.

<figure className="figure w-100 text-center">
  <img
    src={'../assets/img/seasonal_illustration.svg'}
    className="w-75 figure-img img-fluid"
    alt="illustration of seasonal variation in transmission rate"
  />
  <figcaption className="figure-caption text-center">
    Figure 2. Seasonal variation in transmission rate is modeled by a cosine. The model allows to specify the
    average R0, the amplitude of the cosine (seasonal forcing), and the month of peak transmission.
  </figcaption>
</figure>


## Transmission reduction

The tool allows one to explore temporal variation in the reduction of transmission by infection control measures.
This is implemented as a curve through time that can be dragged by the mouse to modify the assumed transmission. The curve is read out and used to change the transmission relative to the base line parameters for $R_0$ and seasonality.
Several studies attempt to estimate the effect of different aspects of social distancing and infection control on the rate of transmission.
A report by [Wang et al](https://www.medrxiv.org/content/10.1101/2020.03.03.20030593v1) estimates a step-wise reduction of $R_0$ from above three to around 1 and then to around 0.3 due to successive measures implemented in Wuhan.
[This study](https://www.pnas.org/content/116/27/13174) investigates the effect of school closures on influenza transmission.
