import { zip, keyBy } from 'lodash'

import { ModelParams, SimulationTimePoint, InternalState, UserResult, ExportedTimePoint } from './types/Result.types'

import { msPerDay } from './initialize'

const eulerStep = 0.5
export const eulerStepsPerDay = Math.round(1 / eulerStep)

interface StateFlux {
  susceptible: number
  exposed: number[]
  infectious: {
    severe: number
    recovered: number
  }
  severe: {
    critical: number
    recovered: number
  }
  critical: {
    severe: number
    fatality: number
  }
  overflow: {
    severe: number
    fatality: number
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

type TimeDerivative = InternalState[]

// NOTE: Assumes all subfields corresponding to populations have the same set of keys
function stepODE(pop: SimulationTimePoint, P: ModelParams, dt: number): SimulationTimePoint {
  const t0 = pop.time
  const t1 = pop.time + (dt / 2) * msPerDay
  const t2 = pop.time + dt * msPerDay

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
  // TODO(nnoll): How to assert that state and grad are always defined?
  const newPop = {
    ...pop,
    state: zip(pop.state, tdot).map(([state, grad]) => {
      return {
        current: {
          infectious: state.current.infectious + dt * grad.current.infectious,
          exposed: state.current.exposed.map((e, i) => e + dt * grad.current.exposed[i]),
          susceptible: state.current.susceptible + dt * grad.current.susceptible,
          severe: state.current.severe + dt * grad.current.severe,
          critical: state.current.critical + dt * grad.current.critical,
          overflow: state.current.overflow + dt * grad.current.overflow,
        },

        cumulative: {
          hospitalized: state.cumulative.hospitalized + dt * grad.cumulative.hospitalized,
          critical: state.cumulative.critical + dt * grad.cumulative.critical,
          recovered: state.cumulative.recovered + dt * grad.cumulative.recovered,
          fatality: state.cumulative.fatality + dt * grad.cumulative.fatality,
        },
      }
    }),
  }

  // Move hospitalized patients according to constrained resources
  // TODO(nnoll): The gradients aren't computed subject to this non-linear constraint
  let freeICUBeds = nICUBeds - sum(newPop.state.map((p) => p.current.critical))

  newPop.state.forEach((demo) => {
    if (demo.current.critical > -freeICUBeds) {
      demo.current.critical += freeICUBeds
      demo.current.overflow -= freeICUBeds
      freeICUBeds = 0
    } else {
      demo.current.overflow += demo.current.critical
      freeICUBeds += demo.current.critical
      demo.current.critical = 0
    }
  })

  newPop.state.forEach((demo) => {
    if (demo.current.overflow > freeICUBeds) {
      demo.current.critical += freeICUBeds
      demo.current.overflow -= freeICUBeds
      freeICUBeds = 0
    } else {
      demo.current.critical += demo.current.overflow
      freeICUBeds -= demo.current.overflow
      demo.current.overflow = 0
    }
  })

  return newPop
}

function sumDerivatives(grads: TimeDerivative[], scale: number[]): TimeDerivative {
  return grads.reduce(
    (sum, grad, i) => {
      return zip(sum, grad).map(([total, g]) => ({
        current: {
          susceptible: total.current.susceptible + scale[i] * g.current.susceptible,
          exposed: total.current.exposed.map((e, i) => e + scale[i] * g.current.exposed[i]),
          infectious: total.current.infectious + scale[i] * g.current.infectious,
          severe: total.current.severe + scale[i] * g.current.severe,
          critical: total.current.critical + scale[i] * g.current.critical,
          overflow: total.current.overflow + scale[i] * g.current.overflow,
        },
        cumulative: {
          critical: total.cumulative.critical + g.cumulative.critical,
          fatality: total.cumulative.fatality + g.cumulative.fatality,
          recovered: total.cumulative.recovered + g.cumulative.recovered,
          hospitalized: total.cumulative.hospitalized + g.cumulative.hospitalized,
        },
      }))
    },
    grads[0].map((demo) => ({
      current: {
        susceptible: 0,
        exposed: new Array(demo.current.exposed.length).fill(0),
        infectious: 0,
        severe: 0,
        critical: 0,
        overflow: 0,
      },
      cumulative: {
        critical: 0,
        fatality: 0,
        recovered: 0,
        hospitalized: 0,
      },
    })),
  )
}

function derivative(fluxes: StateFlux[]): TimeDerivative {
  return fluxes.map((flux) => {
    let fluxIn = flux.susceptible
    const exposed = flux.exposed.map((fluxOut) => {
      const e = fluxIn - fluxOut
      fluxIn = fluxOut
      return e
    })

    return {
      current: {
        susceptible: -flux.susceptible,
        exposed: exposed,
        infectious: fluxIn - flux.infectious.severe - flux.infectious.recovered,
        severe:
          flux.infectious.severe +
          flux.critical.severe +
          flux.overflow.severe -
          flux.severe.critical -
          flux.severe.recovered,
        critical: flux.severe.critical - flux.critical.severe - flux.critical.fatality,
        overflow: -(flux.overflow.severe + flux.overflow.fatality),
      },
      cumulative: {
        recovered: flux.infectious.recovered + flux.severe.recovered,
        hospitalized: flux.infectious.severe,
        critical: flux.severe.critical,
        fatality: flux.critical.fatality + flux.overflow.fatality,
      },
    }
  })
}

// Compute all fluxes (apart from overflow states) barring no hospital bed constraints
function fluxes(time: number, pop: SimulationTimePoint, P: ModelParams): StateFlux[] {
  const fracInfected = sum(pop.state.map((d) => d.current.infectious)) / P.populationServed

  return zip(pop.state, P.rates, P.fracs).map(([state, rate, frac]) => {
    return {
      susceptible: rate.imports + (1 - frac.isolated) * rate.infection(time) * state.current.susceptible * fracInfected,
      exposed: state.current.exposed.map((e) => e * rate.latency * state.current.exposed.length),
      infectious: {
        recovered: state.current.infectious * rate.recovery,
        severe: state.current.infectious * rate.severe,
      },
      severe: {
        recovered: state.current.severe * rate.discharge,
        critical: state.current.severe * rate.critical,
      },
      critical: {
        severe: state.current.critical * rate.stabilize,
        fatality: state.current.critical * rate.fatality,
      },
      overflow: {
        severe: state.current.overflow * rate.stabilize,
        fatality: state.current.overflow * rate.overflowFatality,
      },
    }
  })
}

const keys = <T>(o: T): Array<keyof T & string> => {
  return Object.keys(o) as Array<keyof T & string>
}

// TODO(nnoll): Need to add a total column...
export function collectTotals(trajectory: SimulationTimePoint[], ages: string[]): ExportedTimePoint[] {
  ages.push('total')
  return trajectory.map((d) => {
    return {
      time: d.time,
      current: {
        susceptible: new Map(d.state.map((p, i) => [ages[i], p.current.susceptible])),
        exposed: new Map(d.state.map((p, i) => [ages[i], p.current.exposed.reduce((a, b) => a + b)])),
        infectious: new Map(d.state.map((p, i) => [ages[i], p.current.infectious])),
        severe: new Map(d.state.map((p, i) => [ages[i], p.current.severe])),
        critical: new Map(d.state.map((p, i) => [ages[i], p.current.critical])),
        overflow: new Map(d.state.map((p, i) => [ages[i], p.current.overflow])),
      },
      cumulative: {
        recovered: new Map(d.state.map((p, i) => [ages[i], p.cumulative.recovered])),
        hospitalized: new Map(d.state.map((p, i) => [ages[i], p.cumulative.hospitalized])),
        critical: new Map(d.state.map((p, i) => [ages[i], p.cumulative.critical])),
        fatality: new Map(d.state.map((p, i) => [ages[i], p.cumulative.fatality])),
      },
    }
  })
}

function title(name: string): string {
  return name === 'critical' ? 'ICU' : name
}

export function exportSimulation(result: UserResult, ageGroups: string[] = ['total']) {
  // Store parameter values

  // Down sample trajectory to once a day.
  // TODO: Make the down sampling interval a parameter

  const categories = {
    current: keys(result.mean[0].current),
    cumulative: keys(result.mean[0].cumulative),
  }
  const header: string[] = ['time']

  categories.current.forEach((category) => {
    ageGroups.forEach((age) => {
      header.push(
        `${title(category)} (${age}) mean`,
        `${title(category)} (${age}) lower bound`,
        `${title(category)} (${age}) upper bound`,
      )
    })
  })

  categories.cumulative.forEach((category) => {
    ageGroups.forEach((age) => {
      header.push(
        `cumulative ${title(category)} (${age}) mean`,
        `cumulative ${title(category)} (${age}) lower bound`,
        `cumulative ${title(category)} (${age}) upper bound`,
      )
    })
  })

  const tsv = [header.join('\t')]

  const seen: Record<string, boolean> = {}
  const { upper, lower } = result

  result.mean.forEach((mean, i) => {
    const t = new Date(mean.time).toISOString().slice(0, 10)
    if (t in seen) {
      return
    }
    seen[t] = true

    let buf = t
    categories.current.forEach((k) => {
      ageGroups.forEach((age) => {
        buf += `\t${Math.round(mean.current[k][age])}\t${Math.round(lower[i].current[k][age])}\t${Math.round(
          upper[i].current[k][age],
        )}`
      })
    })
    categories.cumulative.forEach((k) => {
      ageGroups.forEach((age) => {
        buf += `\t${Math.round(mean.cumulative[k][age])}\t${Math.round(lower[i].cumulative[k][age])}\t${Math.round(
          upper[i].cumulative[k][age],
        )}`
      })
    })

    tsv.push(buf)
  })

  return tsv.join('\n')
}
