// import { importMDX } from 'mdx.macro';
import React, { Component, lazy, Suspense } from 'react';
import { BlockMath, InlineMath } from 'react-katex';

// const AboutMD = lazy(() => importMDX('../../assets/text/about.md'));

export class AboutComponent extends Component {
  render() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        {/* <AboutMD /> */}

        <h2>Details of the model</h2>
        <p>Qualitatively we model the epidemic dynamics with the following subpopulations:</p>
        <ul>
          <li>Susceptible individuals [<InlineMath math={'S'} />] are exposed to the virus by contact with an infected individual.</li>
          <li>Exposed individuals [<InlineMath math={'E'} />] progress towards a symptomatic state on average time [<InlineMath math={'t_l'} />] </li>
          <li>Infected individuals [<InlineMath math={'I'} />] infect an average of [<InlineMath math={'R_0'} />] secondary infections. On a time-scale of [<InlineMath math={'t_i'} />], infected individuals either recover or progress towards hospitalization.</li>
          <li>Hospitalized individuals [<InlineMath math={'H'} />] either recover or worsen towards a critical state on a time-scale of [<InlineMath math={'t_h'} />].</li>
          <li>Critical individuals [<InlineMath math={'C'} />] model ICU usage. They either return to the hospital state or die [<InlineMath math={'D'} />] on a time-scale of [<InlineMath math={'t_c'} />]</li>
          <li>Recovered individuals [<InlineMath math={'R'} />] can not be infected again.</li>
        </ul>
        <p>
          Subpopulations are delineated by age classes, indexed by [<InlineMath math={'a'} />], to allow for variable transition rates dependent upon age.
          Quantitatively, we solve the following system of equations to estimate hospital usage:
        </p>

        <div className="text-left">
          <BlockMath math={String.raw`
            \begin{aligned}
            \frac{dS_{a}(t)}{dt} & = - \beta_a(t) S_a(t)\sum_{b}I_b(t) \\
            \frac{dE_{a}(t)}{dt} & = \beta_a(t) S_a(t)\sum_{b}I_b(t) - E_{a}(t)/t_l \\
            \frac{dI_{a}(t)}{dt} & = E_{a}(t)/t_l - I_a(t)/t_i \\
            \frac{dH_{a}(t)}{dt} & = (1-m_a) I_a(t)/t_i + (1-f_a) C_a(t)/t_c - H_a(t)/t_h \\
            \frac{dC_{a}(t)}{dt} & = c_a H_a(t)/t_h - C_a(t)/t_c \\
            \frac{dR_{a}(t)}{dt} & = m_a I_a(t)/t_i + (1-c_a)H_a(t)/t_h \\
            \frac{dD_{a}(t)}{dt} & = f_a C_a(t)/t_c
            \end{aligned}
          `} />
        </div>

        <p>The parameters of this model fall into three categories: a time dependent infection rate <InlineMath math={String.raw`\beta(t)`} /> time scales of transition to a different subpopulation <InlineMath math={'t_l, t_i, t_h, t_c'} />, and age specific parameters <InlineMath math={'m_a, c_a'} /> and <InlineMath math={'f_a'} /> that determine relative rates of different outcomes.
          The latency time from infection to infectiousness is <InlineMath math={'t_l'} />, the time an individual is infectious after which he/she either recovers or falls severely ill is <InlineMath math={'t_i'} />, the time a sick person recovers or deteriorates into a critical state is <InlineMath math={'t_h'} />, and the time a person remains critical before dying or stabilizing is <InlineMath math={'t_c'} />.
          The fraction of infectious that are asymptomatic or mild is <InlineMath math={'m_a'} />, the fraction of severe cases that turn critical is <InlineMath math={'c_a'} />, and the fraction of critical cases that are fatal is <InlineMath math={'f_a'} />.
        </p>

        <p>
          The transmission rate <InlineMath math={String.raw`\beta_a(t)`} /> is given by
        </p>

        <div className="text-left">

          <BlockMath math={String.raw`
            \beta_a(t) = R_0 \zeta_a M(t) (1+\varepsilon \cos(2\pi (t-t_{max})))/t_i
          `} />

        </div>

        <p>
          where <InlineMath math={String.raw`\zeta_a`} /> is the degree to which particular age groups are isolated from the rest of the population, <InlineMath math={'M(t)'} /> is the time course of mitigation measures, <InlineMath math={String.raw`\varepsilon`} /> is the amplitude of seasonal variation in transmissibility, and <InlineMath math={'t_{max}'} /> is the time of the year of peak transmission.
        </p>

        <h2>Parameters</h2>
        <ul>
          <li>Many estimates of <InlineMath math={'R_0'} /> are in the [range of 2-3](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7001239/) with some estimates pointing to considerably [higher values](https://www.medrxiv.org/content/10.1101/2020.02.10.20021675v1).</li>
          <li>The serial interval, that is the time between subsequent infections in a transmission chain, was [estimated to be 7-8 days](https://www.nejm.org/doi/full/10.1056/NEJMoa2001316).</li>
          <li>The China CDC compiled [extensive data on severity and fatality of more than 40 thousand confirmed cases](http://weekly.chinacdc.cn/en/article/id/e53946e2-c6c4-41e9-9a9b-fea8db1a8f51).</li>
          In addition, we assume that a substantial fraction of infections, especially in the young, go unreported. This is encoded in the columns "Confirmed [% of total]".
         <li>Seasonal variation in transmission is common for many respiratory viruses but the strength of seasonal forcing for COVID19 are uncertain. For more information, see a [study by us](https://smw.ch/article/doi/smw.2020.20224) and by [Kissler et al](https://www.medrxiv.org/content/10.1101/2020.03.04.20031112v1).</li>
        </ul>

        <figure className="figure w-100 text-center">
          <img src={'../assets/img/unibas_logo.png'} className="w-40 figure-img" alt="University of Basel" />
          <figcaption className="figure-caption text-center">
            COVID19-scenarios is developed at the University of Basel.
          </figcaption>
        </figure>

      </Suspense>
    )
  }
}
