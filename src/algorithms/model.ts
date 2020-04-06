import { AllParamsFlat } from './types/Param.types'
import { SeverityTableRow } from '../components/Main/Scenario/SeverityTable'
import {
  ModelParams,
  SimulationTimePoint,
  InternalCurrentData,
  CumulativeData,
  UserResult,
  ExportedTimePoint,
} from './types/Result.types'

const msPerDay = 1000 * 60 * 60 * 24
const eulerStep = 0.05
export const eulerStepsPerDay = Math.round(1 / eulerStep)

const monthToDay = (m: number) => {
  return m * 30 + 15
}

const jan2020 = new Date('2020-01-01').valueOf() // time in ms

/**
 *
 * @param time - point in time, until which simulation runs, as epoch time
 * @param avgInfectionRate
 * @param peakMonth - counting number in range of 0-11
 * @param seasonalForcing -  seasonal variation in transmission. Usually a decimal number, e. g. 0.2
 * @returns
 */
export function infectionRate(
  time: number,
  avgInfectionRate: number,
  peakMonth: number,
  seasonalForcing: number,
): number {
  // this is super hacky
  const phase = ((time - jan2020) / msPerDay / 365 - monthToDay(peakMonth) / 365) * 2 * Math.PI
  return avgInfectionRate * (1 + seasonalForcing * Math.cos(phase))
}

export function getPopulationParams(
  params: AllParamsFlat,
  severity: SeverityTableRow[],
  ageCounts: Record<string, number>,
  containment: (t: Date) => number,
): ModelParams {
  // TODO: Make this a form-adjustable factor
  const pop: ModelParams = {
    ageDistribution: {},
    frac: {
      severe: {},
      critical: {},
      fatal: {},
      isolated: {},
    },
    rate: {
      latency: 1 / params.latencyTime,
      infection: () => -Infinity, // Dummy infectionRate function. This is set below.
      recovery: {},
      severe: {},
      discharge: {},
      critical: {},
      stabilize: {},
      fatality: {},
      overflowFatality: {},
    },
    importsPerDay: { total: params.importsPerDay },

    populationServed: params.populationServed,
    numberStochasticRuns: params.numberStochasticRuns,
    hospitalBeds: params.hospitalBeds,
    ICUBeds: params.ICUBeds,
  }

  // Compute age-stratified parameters
  const total = severity.map((d) => d.ageGroup).reduce((a, b) => a + ageCounts[b], 0)

  let severeFrac = 0
  let criticalFracHospitalized = 0
  let fatalFracCritical = 0
  let avgIsolatedFrac = 0
  severity.forEach((d) => {
    const freq = (1.0 * ageCounts[d.ageGroup]) / total
    pop.ageDistribution[d.ageGroup] = freq
    pop.frac.severe[d.ageGroup] = (d.severe / 100) * (d.confirmed / 100)
    pop.frac.critical[d.ageGroup] = pop.frac.severe[d.ageGroup] * (d.critical / 100)
    pop.frac.fatal[d.ageGroup] = pop.frac.critical[d.ageGroup] * (d.fatal / 100)

    const dHospital = pop.frac.severe[d.ageGroup]
    const dCritical = d.critical / 100
    const dFatal = d.fatal / 100

    // d.isolated is possible undefined
    const isolated = d.isolated ?? 0
    severeFrac += freq * dHospital
    criticalFracHospitalized += freq * dCritical
    fatalFracCritical += freq * dFatal
    avgIsolatedFrac += (freq * isolated) / 100

    // Age specific rates
    pop.frac.isolated[d.ageGroup] = isolated / 100
    pop.rate.recovery[d.ageGroup] = (1 - dHospital) / params.infectiousPeriod
    pop.rate.severe[d.ageGroup] = dHospital / params.infectiousPeriod
    pop.rate.discharge[d.ageGroup] = (1 - dCritical) / params.lengthHospitalStay
    pop.rate.critical[d.ageGroup] = dCritical / params.lengthHospitalStay
    pop.rate.stabilize[d.ageGroup] = (1 - dFatal) / params.lengthICUStay
    pop.rate.fatality[d.ageGroup] = dFatal / params.lengthICUStay
    pop.rate.overflowFatality[d.ageGroup] = params.overflowSeverity * pop.rate.fatality[d.ageGroup]
  })

  // Get import rates per age class (assume flat)
  const L = Object.keys(pop.rate.recovery).length
  Object.keys(pop.rate.recovery).forEach((k) => {
    pop.importsPerDay[k] = params.importsPerDay / L
  })

  // Population average rates
  pop.rate.recovery.total = (1 - severeFrac) / params.infectiousPeriod
  pop.rate.severe.total = severeFrac / params.infectiousPeriod
  pop.rate.discharge.total = (1 - criticalFracHospitalized) / params.lengthHospitalStay
  pop.rate.critical.total = criticalFracHospitalized / params.lengthHospitalStay
  pop.rate.fatality.total = fatalFracCritical / params.lengthICUStay
  pop.rate.stabilize.total = (1 - fatalFracCritical) / params.lengthICUStay
  pop.rate.overflowFatality.total = (params.overflowSeverity * fatalFracCritical) / params.lengthICUStay
  pop.frac.isolated.total = avgIsolatedFrac

  // Infectivity dynamics
  const avgInfectionRate = params.r0 / params.infectiousPeriod
  pop.rate.infection = (time: Date) =>
    containment(time) * infectionRate(time.valueOf(), avgInfectionRate, params.peakMonth, params.seasonalForcing)

  return pop
}

export function initializePopulation(
  N: number,
  numCases: number,
  t0: number,
  ages: Record<string, number>,
): SimulationTimePoint {
  // FIXME: Why it can be `undefined`? Can it also be `null`?
  if (ages === undefined) {
    const put = (x: number) => {
      return { total: x }
    }
    const putarr = (x: number) => {
      return { total: [x, x, x] }
    }

    return {
      time: t0,
      current: {
        susceptible: put(N - numCases),
        exposed: putarr(0),
        infectious: put(numCases),
        severe: put(0),
        critical: put(0),
        overflow: put(0),
      },
      cumulative: {
        recovered: put(0),
        hospitalized: put(0),
        critical: put(0),
        fatality: put(0),
      },
    }
  }
  const Z = Object.values(ages).reduce((a, b) => a + b)
  const pop: SimulationTimePoint = {
    time: t0,
    current: {
      susceptible: {},
      exposed: {},
      infectious: {},
      severe: {},
      critical: {},
      overflow: {},
    },
    cumulative: {
      recovered: {},
      hospitalized: {},
      critical: {},
      fatality: {},
    },
  }
  // specification of the initial condition: there are numCases at tMin
  // of those, 0.3 are infectious, the remainder is exposed and will turn
  // infectious as they propagate through the exposed categories.
  const initialInfectiousFraction = 0.3

  // TODO: Ensure the sum is equal to N!
  Object.keys(ages).forEach((k, i) => {
    const n = Math.round((ages[k] / Z) * N)
    pop.current.susceptible[k] = n
    pop.current.exposed[k] = [0, 0, 0]
    pop.current.infectious[k] = 0
    pop.current.severe[k] = 0
    pop.current.critical[k] = 0
    pop.current.overflow[k] = 0
    pop.cumulative.hospitalized[k] = 0
    pop.cumulative.recovered[k] = 0
    pop.cumulative.critical[k] = 0
    pop.cumulative.fatality[k] = 0
    if (i === Math.round(Object.keys(ages).length / 2)) {
      pop.current.susceptible[k] -= numCases
      pop.current.infectious[k] = initialInfectiousFraction * numCases
      const e = ((1 - initialInfectiousFraction) * numCases) / pop.current.exposed[k].length
      pop.current.exposed[k] = pop.current.exposed[k].map((_) => e)
    }
  })

  return pop
}

interface StateFlux {
  susceptible: Record<string, number>
  exposed: Record<string, number[]>
  infectious: {
    severe: Record<string, number>
    recovered: Record<string, number>
  }
  severe: {
    critical: Record<string, number>
    recovered: Record<string, number>
  }
  critical: {
    severe: Record<string, number>
    fatality: Record<string, number>
  }
  overflow: {
    severe: Record<string, number>
    fatality: Record<string, number>
  }
}

export function evolve(
  pop: SimulationTimePoint,
  P: ModelParams,
  tMax: number,
  sample: (x: number) => number,
): SimulationTimePoint {
  const dT: number = tMax - pop.time
  const nSteps: number = Math.max(1, Math.round(dT / eulerStep))
  const dt = dT / nSteps
  let currState = pop
  for (let i = 0; i < nSteps; i++) {
    currState = stepODE(currState, P, dt, sample)
  }
  return currState
}

interface TimeDerivative {
  current: InternalCurrentData
  cumulative: CumulativeData
}

// NOTE: Assumes all subfields corresponding to populations have the same set of keys
function stepODE(
  pop: SimulationTimePoint,
  P: ModelParams,
  dt: number,
  sample: (x: number) => number,
): SimulationTimePoint {
  const sum = (dict: Record<string, number>): number => {
    return Object.values(dict).reduce((a, b) => a + b, 0)
  }

  const gz = (x: number): number => {
    return x > 0 ? x : 0
  }

  // Initialize new state
  const newTime = new Date(pop.time + dt * msPerDay)
  const newPop: SimulationTimePoint = {
    time: newTime.valueOf(),
    current: {
      susceptible: {},
      exposed: {},
      infectious: {},
      severe: {},
      critical: {},
      overflow: {},
    },
    cumulative: {
      recovered: {},
      hospitalized: {},
      critical: {},
      fatality: {},
    },
  }

  // Calculate time derivatives
  const flux = fluxes(newTime, pop, P)
  const tdot = derivatives(flux)

  // Helper functions
  // TODO(nnoll): Sort out types
  const update = (age, kind, compartment) => {
    newPop[kind][compartment][age] = gz(pop[kind][compartment][age] + sample(dt * tdot[kind][compartment][age]))
  }

  const updateWith = (age, kind, compartment, value) => {
    newPop[kind][compartment][age] = gz(pop[kind][compartment][age] + value)
  }

  const updateAt = (age, kind, compartment, i) => {
    newPop[kind][compartment][age][i] = gz(
      pop[kind][compartment][age][i] + sample(dt * tdot[kind][compartment][age][i]),
    )
  }

  const ages = Object.keys(pop.current.infectious).sort()
  ages.forEach((age) => {
    newPop.current.exposed[age] = Array(tdot.current.exposed[age].length)

    update(age, 'current', 'susceptible')
    for (let i = 0; i < pop.current.exposed[age].length; i++) {
      updateAt(age, 'current', 'exposed', i)
    }
    update(age, 'current', 'infectious')
    update(age, 'current', 'susceptible')
    update(age, 'current', 'severe')
    update(age, 'current', 'susceptible')

    update(age, 'cumulative', 'hospitalized')
    update(age, 'cumulative', 'critical')
    update(age, 'cumulative', 'fatality')
    update(age, 'cumulative', 'recovered')
  })

  // Move hospitalized patients according to constrained resources
  let freeICUBeds =
    P.ICUBeds - (sum(pop.current.critical) - dt * (sum(flux.critical.severe) - sum(flux.critical.fatality)))

  ages.forEach((age) => {
    if (freeICUBeds > flux.severe.critical[age]) {
      freeICUBeds -= dt * flux.severe.critical[age]
      updateWith(
        age,
        'current',
        'critical',
        +dt * (flux.severe.critical[age] - flux.critical.severe[age] - flux.critical.fatality[age]),
      )
      updateWith(age, 'current', 'overflow', -dt * (flux.overflow.severe[age] + flux.overflow.fatality[age]))
    } else if (freeICUBeds > 0) {
      const newOverflow = dt * flux.severe.critical[age] - freeICUBeds
      updateWith(
        age,
        'current',
        'critical',
        freeICUBeds - dt * (flux.critical.severe[age] - flux.critical.fatality[age]),
      )
      updateWith(
        age,
        'current',
        'overflow',
        newOverflow - dt * (flux.overflow.severe[age] + flux.overflow.fatality[age]),
      )
      freeICUBeds = 0
    } else {
      updateWith(age, 'current', 'critical', -dt * (flux.critical.severe[age] + flux.critical.fatality[age]))
      updateWith(
        age,
        'current',
        'overflow',
        +dt * (flux.severe.critical[age] - flux.overflow.severe[age] - flux.overflow.fatality[age]),
      )
    }
  })

  // If any overflow patients are left AND there are free beds, move them back.
  // Again, move w/ lower age as priority.
  ages.forEach((age) => {
    if (freeICUBeds > 0) {
      if (newPop.current.overflow[age] < freeICUBeds) {
        newPop.current.critical[age] += newPop.current.overflow[age]
        freeICUBeds -= newPop.current.overflow[age]
        newPop.current.overflow[age] = 0
      } else {
        newPop.current.critical[age] += freeICUBeds
        newPop.current.overflow[age] -= freeICUBeds
        freeICUBeds = 0
      }
    }
  })

  return newPop
}

function derivatives(flux: StateFlux): TimeDerivative {
  const grad: TimeDerivative = {
    current: {
      susceptible: {},
      exposed: {},
      infectious: {},
      severe: {},
      critical: {},
      overflow: {},
    },
    cumulative: {
      recovered: {},
      hospitalized: {},
      critical: {},
      fatality: {},
    },
  }

  const ages = Object.keys(flux.susceptible)
  ages.forEach((age) => {
    grad.current.exposed[age] = Array(flux.exposed[age].length)

    grad.current.susceptible[age] = -flux.susceptible[age]
    let fluxIn = flux.susceptible[age]
    flux.exposed[age].forEach((fluxOut, i) => {
      grad.current.exposed[age][i] = fluxIn - fluxOut
      fluxIn = fluxOut
    })
    grad.current.infectious[age] = fluxIn - flux.infectious.severe[age] - flux.infectious.recovered[age]
    grad.current.severe[age] =
      flux.infectious.severe[age] +
      flux.critical.severe[age] +
      flux.overflow.severe[age] -
      flux.severe.critical[age] -
      flux.severe.recovered[age]
    grad.current.critical[age] = flux.severe.critical[age] - flux.critical.severe[age] - flux.critical.fatality[age]
    grad.current.overflow[age] = -flux.overflow.fatality[age] - flux.overflow.severe[age]

    // Cumulative categories
    grad.cumulative.recovered[age] = flux.infectious.recovered[age] + flux.severe.recovered[age]
    grad.cumulative.hospitalized[age] = flux.infectious.severe[age] + flux.infectious.severe[age]
    grad.cumulative.critical[age] = flux.severe.recovered[age] + flux.severe.recovered[age]
    grad.cumulative.fatality[age] = flux.critical.fatality[age] + flux.overflow.fatality[age]
  })

  return grad
}

function fluxes(time: Date, pop: SimulationTimePoint, P: ModelParams): StateFlux {
  const sum = (dict: Record<string, number>): number => {
    return Object.values(dict).reduce((a, b) => a + b, 0)
  }

  // Convention: flux is labelled by the state
  const flux: StateFlux = {
    susceptible: {},
    exposed: {},
    infectious: {
      severe: {},
      recovered: {},
    },
    severe: {
      critical: {},
      recovered: {},
    },
    critical: {
      severe: {},
      fatality: {},
    },
    overflow: {
      severe: {},
      fatality: {},
    },
  }

  // Compute all fluxes (apart from overflow states) barring no hospital bed constraints
  const fracInfected = sum(pop.current.infectious) / P.populationServed

  const ages = Object.keys(pop.current.infectious).sort()
  ages.forEach((age) => {
    // Initialize all multi-faceted states with internal arrays
    flux.exposed[age] = Array(pop.current.exposed[age].length)

    // Susceptible -> Exposed
    flux.susceptible[age] =
      P.importsPerDay[age] +
      (1 - P.frac.isolated[age]) * P.rate.infection(time) * pop.current.susceptible[age] * fracInfected

    // Exposed -> Internal -> Infectious
    pop.current.exposed[age].forEach((exposed, i, exposedArray) => {
      flux.exposed[age][i] = P.rate.latency * exposed * exposedArray.length
    })

    // Infectious -> Recovered/Critical
    flux.infectious.recovered[age] = pop.current.infectious[age] * P.rate.recovery[age]
    flux.infectious.severe[age] = pop.current.infectious[age] * P.rate.severe[age]

    // Severe -> Recovered/Critical
    flux.severe.recovered[age] = pop.current.severe[age] * P.rate.discharge[age]
    flux.severe.critical[age] = pop.current.severe[age] * P.rate.critical[age]

    // Critical -> Severe/Fatality
    flux.critical.severe[age] = pop.current.critical[age] * P.rate.stabilize[age]
    flux.critical.fatality[age] = pop.current.critical[age] * P.rate.fatality[age]

    // Overflow -> Severe/Fatality
    flux.overflow.severe[age] = pop.current.overflow[age] * P.rate.stabilize[age]
    flux.overflow.fatality[age] = pop.current.overflow[age] * P.rate.overflowFatality[age]
  })

  return flux
}

const keys = <T>(o: T): Array<keyof T & string> => {
  return Object.keys(o) as Array<keyof T & string>
}

export function collectTotals(trajectory: SimulationTimePoint[]): UserResult {
  // FIXME: parameter reassign
  const res: UserResult = { trajectory: [] }

  trajectory.forEach((d) => {
    const tp: ExportedTimePoint = {
      time: d.time,
      current: {
        susceptible: {},
        severe: {},
        exposed: {},
        overflow: {},
        critical: {},
        infectious: {},
      },
      cumulative: {
        recovered: {},
        hospitalized: {},
        critical: {},
        fatality: {},
      },
    }

    keys(d.current).forEach((k) => {
      if (k === 'exposed') {
        tp.current[k].total = 0
        Object.values(d.current[k]).forEach((x) => {
          x.forEach((y) => {
            tp.current[k].total += y
          })
        })
        Object.keys(d.current[k]).forEach((a) => {
          tp.current[k][a] = d.current[k][a].reduce((a, b) => a + b, 0)
        })
      } else {
        tp.current[k] = { ...d.current[k] }
        tp.current[k].total = Object.values(d.current[k]).reduce((a, b) => a + b)
      }
    })

    keys(d.cumulative).forEach((k) => {
      tp.cumulative[k] = { ...d.cumulative[k] }
      tp.cumulative[k].total = Object.values(d.cumulative[k]).reduce((a, b) => a + b)
    })

    res.trajectory.push(tp)
  })

  return res
}

export function exportSimulation(result: UserResult) {
  // Store parameter values

  // Down sample trajectory to once a day.
  // TODO: Make the down sampling interval a parameter

  const header = keys(result.trajectory[0].current)
  const tsvHeader: string[] = header.map((x) => (x == 'critical' ? 'ICU' : x))

  const headerCumulative = keys(result.trajectory[0].cumulative)
  const tsvHeaderCumulative = headerCumulative.map((x) => `cumulative_${x}`)

  const tsv = [`time\t${tsvHeader.concat(tsvHeaderCumulative).join('\t')}`]

  const pop: Record<string, boolean> = {}
  result.trajectory.forEach((d) => {
    const t = new Date(d.time).toISOString().slice(0, 10)
    if (t in pop) {
      return
    } // skip if date is already in table
    pop[t] = true
    let buf = t
    header.forEach((k) => {
      buf += `\t${Math.round(d.current[k].total)}`
    })

    headerCumulative.forEach((k) => {
      buf += `\t${Math.round(d.cumulative[k].total)}`
    })
    tsv.push(buf)
  })

  return tsv.join('\n')
}
