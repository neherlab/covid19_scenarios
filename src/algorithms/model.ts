import {
  ModelParams,
  SimulationTimePoint,
  InternalCurrentData,
  InternalCumulativeData,
  Trajectory,
  ExportedTimePoint,
} from './types/Result.types'

import { msPerDay } from './initialize'

const eulerStep = 0.5
export const eulerStepsPerDay = Math.round(1 / eulerStep)

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
    palliative: number[]
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
  const t0 = pop.time
  const t1 = pop.time + (dt / 2) * msPerDay
  const t2 = pop.time + dt * msPerDay

  const k1 = derivative(fluxes(t0, pop, P))
  const k2 = derivative(fluxes(t1, advanceState(pop, k1, dt / 2, P.icuBeds), P))
  const k3 = derivative(fluxes(t1, advanceState(pop, k2, dt / 2, P.icuBeds), P))
  const k4 = derivative(fluxes(t2, advanceState(pop, k3, dt, P.icuBeds), P))

  const tdot = sumDerivatives([k1, k2, k3, k4], [1 / 6, 1 / 3, 1 / 3, 1 / 6])

  const state = advanceState(pop, tdot, dt, P.icuBeds)
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
    time: 0,
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
  // @ts-ignore
  const update = (age, kind, compartment) => {
    // @ts-ignore
    newPop[kind][compartment][age] = gz(pop[kind][compartment][age] + dt * tdot[kind][compartment][age])
  }

  // @ts-ignore
  const updateAt = (age, kind, compartment, i) => {
    // @ts-ignore
    newPop[kind][compartment][age][i] = gz(pop[kind][compartment][age][i] + dt * tdot[kind][compartment][age][i])
  }

  for (let age = 0; age < pop.current.infectious.length; age++) {
    newPop.current.exposed[age] = Array(tdot.current.exposed[age].length)

    update(age, 'current', 'susceptible')
    for (let i = 0; i < pop.current.exposed[age].length; i++) {
      updateAt(age, 'current', 'exposed', i)
    }

    update(age, 'current', 'critical')
    update(age, 'current', 'infectious')
    update(age, 'current', 'overflow')
    update(age, 'current', 'severe')
    update(age, 'current', 'susceptible')

    update(age, 'cumulative', 'critical')
    update(age, 'cumulative', 'fatality')
    update(age, 'cumulative', 'hospitalized')
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
      flux.severe.palliative[age] -
      flux.severe.recovered[age]
    grad.current.critical[age] = flux.severe.critical[age] - flux.critical.severe[age] - flux.critical.fatality[age]
    grad.current.overflow[age] = -(flux.overflow.severe[age] + flux.overflow.fatality[age])

    // Cumulative categories
    grad.cumulative.recovered[age] = flux.infectious.recovered[age] + flux.severe.recovered[age]
    grad.cumulative.hospitalized[age] = flux.infectious.severe[age]
    grad.cumulative.critical[age] = flux.severe.critical[age]
    grad.cumulative.fatality[age] =
      flux.critical.fatality[age] + flux.overflow.fatality[age] + flux.severe.palliative[age]
  }

  return grad
}

function fluxes(time: number, pop: SimulationTimePoint, P: ModelParams): StateFlux {
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
      palliative: [],
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

    // Severe -> Recovered/Palliative/Critical
    flux.severe.recovered[age] = pop.current.severe[age] * P.rate.discharge[age]
    flux.severe.critical[age] = pop.current.severe[age] * P.rate.critical[age]
    flux.severe.palliative[age] = pop.current.severe[age] * P.rate.palliative[age]

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

export function collectTotals(trajectory: SimulationTimePoint[], ages: string[]): ExportedTimePoint[] {
  const res: ExportedTimePoint[] = []

  trajectory.forEach((d, day) => {
    const prevDay = day > 7 ? day - 7 : 0
    const tp: ExportedTimePoint = {
      time: d.time,
      current: {
        susceptible: {},
        severe: {},
        exposed: {},
        overflow: {},
        critical: {},
        infectious: {},
        weeklyFatality: {},
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
      } else if (k === 'weeklyFatality') {
        ages.forEach((age, i) => {
          tp.current.weeklyFatality[age] = d.cumulative.fatality[i] - trajectory[prevDay].cumulative.fatality[i]
        })
        tp.current.weeklyFatality.total =
          d.cumulative.fatality.reduce((a, b) => a + b) -
          trajectory[prevDay].cumulative.fatality.reduce((a, b) => a + b)
      } else {
        ages.forEach((age, i) => {
          // @ts-ignore
          tp.current[k][age] = d.current[k][i]
        })
        // @ts-ignore
        tp.current[k].total = d.current[k].reduce((a, b) => a + b)
      }
    })

    Object.keys(tp.cumulative).forEach((k, day) => {
      ages.forEach((age, i) => {
        // @ts-ignore
        tp.cumulative[k][age] = d.cumulative[k][i]
      })
      // @ts-ignore
      tp.cumulative[k].total = d.cumulative[k].reduce((a, b) => a + b, 0)
    })

    res.push(tp)
  })

  return res
}

function title(name: string): string {
  return name === 'critical' ? 'ICU' : name
}

export interface SerializeTrajectoryParams {
  trajectory: Trajectory
  detailed: boolean
}

export function serializeTrajectory({ trajectory, detailed }: SerializeTrajectoryParams) {
  // Store parameter values

  // Down sample trajectory to once a day.
  // TODO: Make the down sampling interval a parameter

  let ageGroups = ['total']
  if (detailed) {
    // FIXME: these keys seem to be numbers. This works, but is not what we want to show in the headers
    const ageGroupsDetailed = Object.keys(trajectory.middle[0].current.severe)

    // FIXME: does detailed include summary or not?
    ageGroups = [...ageGroups, ...ageGroupsDetailed]
  }

  const categories = {
    current: keys(trajectory.middle[0].current),
    cumulative: keys(trajectory.middle[0].cumulative),
  }
  const header: string[] = ['time']

  categories.current.forEach((category) => {
    ageGroups.forEach((age) => {
      header.push(
        `${title(category)} (${age}) median`,
        `${title(category)} (${age}) lower bound`,
        `${title(category)} (${age}) upper bound`,
      )
    })
  })

  categories.cumulative.forEach((category) => {
    ageGroups.forEach((age) => {
      header.push(
        `cumulative ${title(category)} (${age}) median`,
        `cumulative ${title(category)} (${age}) lower bound`,
        `cumulative ${title(category)} (${age}) upper bound`,
      )
    })
  })

  const tsv = [header.join('\t')]

  const seen: Record<string, boolean> = {}
  const { upper, lower } = trajectory

  trajectory.middle.forEach((mid, i) => {
    const t = new Date(mid.time).toISOString().slice(0, 10)
    if (t in seen) {
      return
    }
    seen[t] = true

    let buf = t
    categories.current.forEach((k) => {
      ageGroups.forEach((age) => {
        buf += `\t${Math.round(mid.current[k][age])}\t${Math.round(lower[i].current[k][age])}\t${Math.round(
          upper[i].current[k][age],
        )}`
      })
    })
    categories.cumulative.forEach((k) => {
      ageGroups.forEach((age) => {
        buf += `\t${Math.round(mid.cumulative[k][age])}\t${Math.round(lower[i].cumulative[k][age])}\t${Math.round(
          upper[i].cumulative[k][age],
        )}`
      })
    })

    tsv.push(buf)
  })

  return tsv.join('\n')
}
