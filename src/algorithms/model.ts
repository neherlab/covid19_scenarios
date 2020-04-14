import { AllParamsFlat, AgeDistribution } from './types/Param.types'
import { SeverityTableRow } from '../components/Main/Scenario/ScenarioTypes'
import {
  ModelParams,
  SimulationTimePoint,
  InternalCurrentData,
  InternalCumulativeData,
  UserResult,
  ExportedTimePoint,
} from './types/Result.types'

const msPerDay = 1000 * 60 * 60 * 24
const eulerStep = 0.5
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
  ageCounts: AgeDistribution,
  containment: (t: Date) => number,
): ModelParams {
  // TODO: Make this a form-adjustable factor
  const pop: ModelParams = {
    ageDistribution: {},
    importsPerDay: [],
    timeDelta: 0,
    timeDeltaDays: 0,
    frac: {
      severe: [],
      critical: [],
      fatal: [],
      isolated: [],
    },
    rate: {
      latency: 1 / params.latencyTime,
      infection: () => -Infinity, // Dummy infectionRate function. This is set below.
      recovery: [],
      severe: [],
      discharge: [],
      critical: [],
      stabilize: [],
      fatality: [],
      overflowFatality: [],
    },

    populationServed: params.populationServed,
    numberStochasticRuns: params.numberStochasticRuns,
    hospitalBeds: params.hospitalBeds,
    ICUBeds: params.ICUBeds,
  }

  // Compute age-stratified parameters
  const total = severity.map((d) => d.ageGroup).reduce((a, b) => a + ageCounts[b as keyof AgeDistribution], 0)

  // NOTE(nnoll): Assumes the age groups of severity table sorted lexiographically and numerically is equivalent
  severity.sort((row1, row2) => {
    if (row1.ageGroup < row2.ageGroup) {
      return -1
    }
    if (row1.ageGroup > row2.ageGroup) {
      return +1
    }
    return 0
  })

  severity.forEach((row, i) => {
    const freq = (1.0 * ageCounts[row.ageGroup as keyof AgeDistribution]) / total
    pop.ageDistribution[row.ageGroup] = freq
    pop.frac.severe[i] = (row.severe / 100) * (row.confirmed / 100)
    pop.frac.critical[i] = pop.frac.severe[i] * (row.critical / 100)
    pop.frac.fatal[i] = pop.frac.critical[i] * (row.fatal / 100)

    const dHospital = pop.frac.severe[i]
    const dCritical = row.critical / 100
    const dFatal = row.fatal / 100

    // row.isolated is possible undefined
    const isolated = row.isolated === undefined ? 0 : row.isolated

    // Age specific rates
    pop.frac.isolated[i] = isolated / 100
    pop.rate.recovery[i] = (1 - dHospital) / params.infectiousPeriod
    pop.rate.severe[i] = dHospital / params.infectiousPeriod
    pop.rate.discharge[i] = (1 - dCritical) / params.lengthHospitalStay
    pop.rate.critical[i] = dCritical / params.lengthHospitalStay
    pop.rate.stabilize[i] = (1 - dFatal) / params.lengthICUStay
    pop.rate.fatality[i] = dFatal / params.lengthICUStay
    pop.rate.overflowFatality[i] = params.overflowSeverity * pop.rate.fatality[i]
  })

  // Get import rates per age class (assume flat)
  const L = Object.keys(pop.rate.recovery).length
  pop.rate.recovery.forEach((_, i) => {
    pop.importsPerDay[i] = params.importsPerDay / L
  })

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
  ages: AgeDistribution,
): SimulationTimePoint {
  const Z = Object.values(ages).reduce((a, b) => a + b)
  const pop: SimulationTimePoint = {
    time: t0,
    current: {
      susceptible: [],
      exposed: [],
      infectious: [],
      severe: [],
      critical: [],
      overflow: [],
    },
    cumulative: {
      recovered: [],
      hospitalized: [],
      critical: [],
      fatality: [],
    },
  }

  // specification of the initial condition: there are numCases at tMin
  // of those, 0.3 are infectious, the remainder is exposed and will turn
  // infectious as they propagate through the exposed categories.
  const initialInfectiousFraction = 0.3

  // TODO: Ensure the sum is equal to N!
  const ageGroups = Object.keys(ages).sort() as (keyof AgeDistribution)[]
  ageGroups.forEach((k, i) => {
    const n = Math.round((ages[k] / Z) * N)
    pop.current.susceptible[i] = n
    pop.current.exposed[i] = [0, 0, 0]
    pop.current.infectious[i] = 0
    pop.current.severe[i] = 0
    pop.current.critical[i] = 0
    pop.current.overflow[i] = 0
    pop.cumulative.hospitalized[i] = 0
    pop.cumulative.recovered[i] = 0
    pop.cumulative.critical[i] = 0
    pop.cumulative.fatality[i] = 0
    if (i === Math.round(ageGroups.length / 2)) {
      pop.current.susceptible[i] -= numCases
      pop.current.infectious[i] = initialInfectiousFraction * numCases
      const e = ((1 - initialInfectiousFraction) * numCases) / pop.current.exposed[i].length
      pop.current.exposed[i] = pop.current.exposed[i].map((_) => e)
    }
  })

  return pop
}

interface StateFlux {
  susceptible: number[]
  exposed: number[][]
  infectious: {
    severe: number[]
    recovered: number[]
  }
  severe: {
    critical: number[]
    recovered: number[]
  }
  critical: {
    severe: number[]
    fatality: number[]
  }
  overflow: {
    severe: number[]
    fatality: number[]
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
    currState = stepODE(currState, P, dt)
  }
  return currState
}

interface TimeDerivative {
  current: InternalCurrentData
  cumulative: InternalCumulativeData
}

// NOTE: Assumes all subfields corresponding to populations have the same set of keys
function stepODE(pop: SimulationTimePoint, P: ModelParams, dt: number): SimulationTimePoint {
  const t0 = new Date(pop.time)
  const t1 = new Date(pop.time + (dt / 2) * msPerDay)
  const t2 = new Date(pop.time + dt * msPerDay)

  const k1 = derivative(fluxes(t0, pop, P))
  const k2 = derivative(fluxes(t1, advanceState(pop, k1, dt / 2, P.ICUBeds), P))
  const k3 = derivative(fluxes(t1, advanceState(pop, k2, dt / 2, P.ICUBeds), P))
  const k4 = derivative(fluxes(t2, advanceState(pop, k3, dt, P.ICUBeds), P))

  const tdot = sumDerivatives([k1, k2, k3, k4], [1 / 6, 1 / 3, 1 / 3, 1 / 6])

  const state = advanceState(pop, tdot, dt, P.ICUBeds)
  state.time = t2.valueOf()

  return state
}

export function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0)
}

export function gz(x: number): number {
  return x > 0 ? x : 0
}

function advanceState(
  pop: SimulationTimePoint,
  tdot: TimeDerivative,
  dt: number,
  nICUBeds: number,
): SimulationTimePoint {
  const newPop: SimulationTimePoint = {
    time: Date.now(),
    current: {
      susceptible: [],
      exposed: [],
      infectious: [],
      severe: [],
      critical: [],
      overflow: [],
    },
    cumulative: {
      recovered: [],
      hospitalized: [],
      critical: [],
      fatality: [],
    },
  }

  // TODO(nnoll): Sort out types
  const update = (age, kind, compartment) => {
    newPop[kind][compartment][age] = gz(pop[kind][compartment][age] + dt * tdot[kind][compartment][age])
  }

  const updateAt = (age, kind, compartment, i) => {
    newPop[kind][compartment][age][i] = gz(pop[kind][compartment][age][i] + dt * tdot[kind][compartment][age][i])
  }

  for (let age = 0; age < pop.current.infectious.length; age++) {
    newPop.current.exposed[age] = Array(tdot.current.exposed[age].length)

    update(age, 'current', 'susceptible')
    for (let i = 0; i < pop.current.exposed[age].length; i++) {
      updateAt(age, 'current', 'exposed', i)
    }
    update(age, 'current', 'infectious')
    update(age, 'current', 'susceptible')
    update(age, 'current', 'severe')
    update(age, 'current', 'susceptible')
    update(age, 'current', 'critical')
    update(age, 'current', 'overflow')

    update(age, 'cumulative', 'hospitalized')
    update(age, 'cumulative', 'critical')
    update(age, 'cumulative', 'fatality')
    update(age, 'cumulative', 'recovered')
  }

  // Move hospitalized patients according to constrained resources
  // TODO(nnoll): The gradients aren't computed subject to this non-linear constraint
  let freeICUBeds = nICUBeds - sum(newPop.current.critical)

  for (let age = pop.current.critical.length - 1; freeICUBeds < 0 && age >= 0; age--) {
    if (newPop.current.critical[age] > -freeICUBeds) {
      newPop.current.critical[age] += freeICUBeds
      newPop.current.overflow[age] -= freeICUBeds
      freeICUBeds = 0
    } else {
      newPop.current.overflow[age] += newPop.current.critical[age]
      freeICUBeds += newPop.current.critical[age]
      newPop.current.critical[age] = 0
    }
  }

  for (let age = 0; freeICUBeds > 0 && age < pop.current.critical.length; age++) {
    if (newPop.current.overflow[age] > freeICUBeds) {
      newPop.current.critical[age] += freeICUBeds
      newPop.current.overflow[age] -= freeICUBeds
      freeICUBeds = 0
    } else {
      newPop.current.critical[age] += newPop.current.overflow[age]
      freeICUBeds -= newPop.current.overflow[age]
      newPop.current.overflow[age] = 0
    }
  }

  return newPop
}

function sumDerivatives(grads: TimeDerivative[], scale: number[]): TimeDerivative {
  const sum: TimeDerivative = {
    current: {
      susceptible: [],
      exposed: [],
      infectious: [],
      severe: [],
      critical: [],
      overflow: [],
    },
    cumulative: {
      hospitalized: [],
      critical: [],
      recovered: [],
      fatality: [],
    },
  }
  for (let age = 0; age < grads[0].current.susceptible.length; age++) {
    sum.current.susceptible[age] = 0
    sum.current.exposed[age] = grads[0].current.exposed[age].map(() => {
      return 0
    })
    sum.current.infectious[age] = 0
    sum.current.critical[age] = 0
    sum.current.overflow[age] = 0
    sum.current.severe[age] = 0

    sum.cumulative.critical[age] = 0
    sum.cumulative.fatality[age] = 0
    sum.cumulative.recovered[age] = 0
    sum.cumulative.hospitalized[age] = 0
  }

  grads.forEach((grad, i) => {
    for (let age = 0; age < grads[0].current.susceptible.length; age++) {
      sum.current.susceptible[age] += scale[i] * grad.current.susceptible[age]
      sum.current.infectious[age] += scale[i] * grad.current.infectious[age]
      grad.current.exposed[age].forEach((e, j) => {
        sum.current.exposed[age][j] += scale[i] * e
      })
      sum.current.severe[age] += scale[i] * grad.current.severe[age]
      sum.current.critical[age] += scale[i] * grad.current.critical[age]
      sum.current.overflow[age] += scale[i] * grad.current.overflow[age]

      sum.cumulative.recovered[age] += scale[i] * grad.cumulative.recovered[age]
      sum.cumulative.fatality[age] += scale[i] * grad.cumulative.fatality[age]
      sum.cumulative.critical[age] += scale[i] * grad.cumulative.critical[age]
      sum.cumulative.hospitalized[age] += scale[i] * grad.cumulative.hospitalized[age]
    }
  })

  return sum
}

function derivative(flux: StateFlux): TimeDerivative {
  const grad: TimeDerivative = {
    current: {
      susceptible: [],
      exposed: [],
      infectious: [],
      severe: [],
      critical: [],
      overflow: [],
    },
    cumulative: {
      recovered: [],
      hospitalized: [],
      critical: [],
      fatality: [],
    },
  }

  for (let age = 0; age < flux.susceptible.length; age++) {
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
    grad.current.overflow[age] = -(flux.overflow.severe[age] + flux.overflow.fatality[age])

    // Cumulative categories
    grad.cumulative.recovered[age] = flux.infectious.recovered[age] + flux.severe.recovered[age]
    grad.cumulative.hospitalized[age] = flux.infectious.severe[age] + flux.infectious.severe[age]
    grad.cumulative.critical[age] = flux.severe.recovered[age] + flux.severe.recovered[age]
    grad.cumulative.fatality[age] = flux.critical.fatality[age] + flux.overflow.fatality[age]
  }

  return grad
}

function fluxes(time: Date, pop: SimulationTimePoint, P: ModelParams): StateFlux {
  // Convention: flux is labelled by the state
  const flux: StateFlux = {
    susceptible: [],
    exposed: [],
    infectious: {
      severe: [],
      recovered: [],
    },
    severe: {
      critical: [],
      recovered: [],
    },
    critical: {
      severe: [],
      fatality: [],
    },
    overflow: {
      severe: [],
      fatality: [],
    },
  }

  // Compute all fluxes (apart from overflow states) barring no hospital bed constraints
  const fracInfected = sum(pop.current.infectious) / P.populationServed

  for (let age = 0; age < pop.current.infectious.length; age++) {
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
  }

  return flux
}

const keys = <T>(o: T): Array<keyof T & string> => {
  return Object.keys(o) as Array<keyof T & string>
}

export function collectTotals(trajectory: SimulationTimePoint[], ages: string[]): UserResult {
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

    // TODO(nnoll): Typescript linting isn't happy here
    Object.keys(tp.current).forEach((k) => {
      if (k === 'exposed') {
        tp.current.exposed.total = 0
        Object.values(d.current.exposed).forEach((x) => {
          x.forEach((y) => {
            tp.current[k].total += y
          })
        })
        ages.forEach((age, i) => {
          tp.current[k][age] = d.current.exposed[i].reduce((a, b) => a + b, 0)
        })
      } else {
        ages.forEach((age, i) => {
          tp.current[k][age] = d.current[k][i]
        })
        tp.current[k].total = d.current[k].reduce((a, b) => a + b)
      }
    })

    Object.keys(tp.cumulative).forEach((k) => {
      ages.forEach((age, i) => {
        tp.cumulative[k][age] = d.cumulative[k][i]
      })
      tp.cumulative[k].total = d.cumulative[k].reduce((a, b) => a + b, 0)
    })

    res.trajectory.push(tp)
  })

  return res
}

export function exportSimulation(result: UserResult, ageGroups: string[] = ['total']) {
  // Store parameter values

  // Down sample trajectory to once a day.
  // TODO: Make the down sampling interval a parameter

  const header = keys(result.trajectory[0].current)
  const tsvHeader: string[] = header.map((x) => (x === 'critical' ? 'ICU' : x))

  const headerCumulative = keys(result.trajectory[0].cumulative)
  const tsvHeaderCumulative = headerCumulative.map((x) => `cumulative_${x}`)

  let buf = 'time'
  tsvHeader.concat(tsvHeaderCumulative).forEach((hdr) => {
    ageGroups.forEach((age) => {
      buf += `\t${hdr} (${age})`
    })
  })
  const tsv = [buf]

  const pop: Record<string, boolean> = {}
  result.trajectory.forEach((d) => {
    const t = new Date(d.time).toISOString().slice(0, 10)
    if (t in pop) {
      return
    } // skip if date is already in table
    pop[t] = true
    let buf = t
    header.forEach((k) => {
      ageGroups.forEach((age) => {
        buf += `\t${Math.round(d.current[k][age])}`
      })
    })

    headerCumulative.forEach((k) => {
      ageGroups.forEach((age) => {
        buf += `\t${Math.round(d.cumulative[k][age])}`
      })
    })
    tsv.push(buf)
  })

  return tsv.join('\n')
}
