import { AllParamsFlat } from './types/Param.types'
import { SeverityTableRow } from '../components/Main/Scenario/SeverityTable'
import { ModelParams, SimulationTimePoint, UserResult, ExportedTimePoint } from './types/Result.types'

const msPerDay = 1000 * 60 * 60 * 24

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
  const timeDeltaDays = 0.25

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

    timeDeltaDays,
    timeDelta: msPerDay * timeDeltaDays,
    populationServed: params.populationServed,
    numberStochasticRuns: params.numberStochasticRuns,
    hospitalBeds: params.hospitalBeds,
    ICUBeds: params.ICUBeds,
  }

  // Compute age-stratified parameters
  const total = severity.map(d => d.ageGroup).reduce((a, b) => a + ageCounts[b], 0)

  let severeFrac = 0
  let criticalFracHospitalized = 0
  let fatalFracCritical = 0
  let avgIsolatedFrac = 0
  severity.forEach(d => {
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
  Object.keys(pop.rate.recovery).forEach(k => {
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
      pop.current.infectious[k] = 0.3 * numCases
      const e = (0.7 * numCases) / pop.current.exposed[k].length
      pop.current.exposed[k] = [e, e, e]
    }
  })

  return pop
}

export interface StateFlux {
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

// NOTE: Assumes all subfields corresponding to populations have the same set of keys
export function evolve(pop: SimulationTimePoint, P: ModelParams, sample: (x: number) => number): SimulationTimePoint {
  const sum = (dict: Record<string, number>): number => {
    return Object.values(dict).reduce((a, b) => a + b, 0)
  }
  const fracInfected = sum(pop.current.infectious) / P.populationServed

  const newTime = new Date(pop.time + P.timeDelta)
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

  // NOTE: Regression on type checking
  // update touches the current data
  // push touches the cumulative data
  const update = (sub: string, age: string, delta: number, index?: number) => {
    if (!index) {
      newPop.current[age] = pop.current[sub][age] + delta
    } else {
      newPop.current[age][index] = pop.current[sub][age][index] + delta
    }
  }

  const push = (sub: string, age: string, delta: number, index?: number) => {
    if (!index) {
      newPop.cumulative[age] = pop.cumulative[sub][age] + delta
    } else {
      newPop.cumulative[age][index] = pop.cumulative[sub][age][index] + delta
    }
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
  const Keys = Object.keys(pop.current.infectious).sort()
  Keys.forEach(age => {
    // Initialize all multi-faceted states with internal arrays
    flux.exposed[age] = []
    newPop.current.exposed[age] = []

    flux.susceptible[age] =
      sample(P.importsPerDay[age] * P.timeDeltaDays) +
      sample(
        (1 - P.frac.isolated[age]) *
          P.rate.infection(newTime) *
          pop.current.susceptible[age] *
          fracInfected *
          P.timeDeltaDays,
      )
    // NOTE: Propagate individuals through internal exposed states
    for (let i = 0; i < pop.current.exposed[age].length; i++) {
      flux.exposed[age][i] = Math.min(
        pop.current.exposed[age][i],
        sample((P.rate.latency * (pop.current.exposed[age][i] * P.timeDeltaDays)) / pop.current.exposed[age].length),
      )
    }
    flux.infectious.recovered[age] = Math.min(
      pop.current.infectious[age],
      sample(pop.current.infectious[age] * P.timeDeltaDays * P.rate.recovery[age]),
    )
    flux.infectious.severe[age] = Math.min(
      pop.current.infectious[age] - flux.infectious.recovered[age],
      sample(pop.current.infectious[age] * P.timeDeltaDays * P.rate.severe[age]),
    )
    flux.severe.recovered[age] = Math.min(
      pop.current.severe[age],
      sample(pop.current.severe[age] * P.timeDeltaDays * P.rate.discharge[age]),
    )

    flux.severe.critical[age] = Math.min(
      pop.current.severe[age] - flux.severe.recovered[age],
      sample(pop.current.severe[age] * P.timeDeltaDays * P.rate.critical[age]),
    )
    flux.critical.severe[age] = Math.min(
      pop.current.critical[age],
      sample(pop.current.critical[age] * P.timeDeltaDays * P.rate.stabilize[age]),
    )
    flux.critical.fatality[age] = Math.min(
      pop.current.critical[age] - flux.critical.severe[age],
      sample(pop.current.critical[age] * P.timeDeltaDays * P.rate.fatality[age]),
    )
    flux.overflow.severe[age] = Math.min(
      pop.current.overflow[age],
      sample(pop.current.overflow[age] * P.timeDeltaDays * P.rate.stabilize[age]),
    )
    flux.overflow.fatality[age] = Math.min(
      pop.current.overflow[age] - flux.overflow.severe[age],
      sample(pop.current.overflow[age] * P.timeDeltaDays * P.rate.overflowFatality[age]),
    )

    update('susceptible', age, -flux.susceptible[age])
    let fluxIn = flux.susceptible[age]
    for (let i = 0; i < flux.exposed[age].length; i++) {
      update('exposed', age, fluxIn - flux.exposed[age][i], i)
      fluxIn = flux.exposed[age][i]
    }
    update('infectious', age, fluxIn - flux.infectious.severe[age] - flux.infectious.recovered[age])
    update(
      'severe',
      age,
      flux.infectious.severe[age] +
        flux.critical.severe[age] +
        flux.overflow.severe[age] -
        flux.severe.critical[age] -
        flux.severe.recovered[age],
    )
    // Cumulative categories
    push('recovered', age, flux.infectious.recovered[age] + flux.severe.recovered[age])
    push('hospitalized', age, flux.infectious.severe[age])
    push('critical', age, flux.severe.critical[age])
    push('fatality', age, flux.critical.fatality[age] + flux.overflow.fatality[age])
  })

  // Move hospitalized patients according to constrained resources
  let freeICUBeds = P.ICUBeds - (sum(pop.current.critical) - sum(flux.critical.severe) - sum(flux.critical.fatality))
  Keys.forEach(age => {
    if (freeICUBeds > flux.severe.critical[age]) {
      freeICUBeds -= flux.severe.critical[age]
      update('critical', age, flux.severe.critical[age] - flux.critical.severe[age] - flux.critical.fatality[age])
      update('overflow', age, -flux.overflow.fatality[age] - flux.overflow.severe[age])
    } else if (freeICUBeds > 0) {
      const newOverflow = flux.severe.critical[age] - freeICUBeds
      update('critical', age, freeICUBeds - flux.critical.severe[age] - flux.critical.fatality[age])
      update('overflow', age, newOverflow - flux.overflow.severe[age] - flux.overflow.fatality[age])
      freeICUBeds = 0
    } else {
      update('critical', age, -flux.critical.severe[age] - flux.critical.fatality[age])
      update('overflow', age, +flux.severe.critical[age] - flux.overflow.fatality[age] - flux.overflow.severe[age])
    }
  })

  // If any overflow patients are left AND there are free beds, move them back.
  // Again, move w/ lower age as priority.
  for (let i = 0; freeICUBeds > 0 && i < Keys.length; i++) {
    const age = Keys[i]
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

  // NOTE: For debug purposes only.
  /*
  const popSum = sum(newPop.susceptible) + sum(newPop.exposed) + sum(newPop.infectious) + sum(newPop.recovered) + sum(newPop.hospitalized) + sum(newPop.critical) + sum(newPop.overflow) + sum(newPop.dead);
  console.log(math.abs(popSum - P.populationServed));
  */

  return newPop
}

const keys = <T>(o: T): Array<keyof T & string> => {
  return Object.keys(o) as Array<keyof T & string>
}

export function collectTotals(trajectory: SimulationTimePoint[]): UserResult {
  // FIXME: parameter reassign
  const res: UserResult = { trajectory: [] }

  trajectory.forEach(d => {
    const tp: ExportedTimePoint = {
      time: d['time'],
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
    keys(d.current).forEach(k => {
      switch (k) {
        case 'exposed':
          tp.current.exposed.total = 0
          Object.values(d.current[k]).forEach(x => {
            x.forEach(y => {
              tp.current[k].total += y
            })
          })
          Object.keys(d.current[k]).forEach(a => {
            tp.current[k][a] = d.current[k][a].reduce((a, b) => a + b, 0)
          })
          break

        default:
          tp.current[k] = Object.assign({}, d.current[k])
          tp.current[k].total = Object.values(d.current[k]).reduce((a, b) => a + b)
      }
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
  const tsv = [header.join('\t')]

  const pop: Record<string, boolean> = {}
  result.trajectory.forEach(d => {
    const t = new Date(d.time).toISOString().slice(0, 10)
    if (t in pop) {
      return
    } // skip if date is already in table
    pop[t] = true
    let buf = '${d.time}'
    header.forEach(k => {
      buf += `\t${Math.round(d.current[k].total)}`
    })
    tsv.push(buf)
  })

  return tsv.join('\n')
}
