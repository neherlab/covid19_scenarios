import { AllParamsFlat } from './types/Param.types'
import { SeverityTableRow } from '../components/Main/Scenario/SeverityTable'
import { ModelParams, SimulationTimePoint, UserResult, ExportedTimePoint } from '../algorithms/types/Result.types'

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
    infectionSeverityRatio: {},
    infectionFatality: {},
    infectionCritical: {},
    hospitalizedRate: {},
    recoveryRate: {},
    dischargeRate: {},
    stabilizationRate: {},
    criticalRate: {},
    deathRate: {},
    overflowDeathRate: {},
    isolatedFrac: {},
    importsPerDay: { total: params.importsPerDay },
    timeDeltaDays,
    // Dummy infectionRate function. This is set below.
    infectionRate: () => -Infinity,
    timeDelta: msPerDay * timeDeltaDays,
    incubationTime: params.incubationTime,
    populationServed: params.populationServed,
    numberStochasticRuns: params.numberStochasticRuns,
    hospitalBeds: params.hospitalBeds,
    ICUBeds: params.ICUBeds,
  }

  // Compute age-stratified parameters
  const total = severity.map((d) => d.ageGroup).reduce((a, b) => a + ageCounts[b], 0)

  let hospitalizedFrac = 0
  let criticalFracHospitalized = 0
  let fatalFracCritical = 0
  let avgIsolatedFrac = 0
  severity.forEach((d) => {
    const freq = (1.0 * ageCounts[d.ageGroup]) / total
    pop.ageDistribution[d.ageGroup] = freq
    pop.infectionSeverityRatio[d.ageGroup] = (d.severe / 100) * (d.confirmed / 100)
    pop.infectionCritical[d.ageGroup] = pop.infectionSeverityRatio[d.ageGroup] * (d.critical / 100)
    pop.infectionFatality[d.ageGroup] = pop.infectionCritical[d.ageGroup] * (d.fatal / 100)

    const dHospital = pop.infectionSeverityRatio[d.ageGroup]
    const dCritical = d.critical / 100
    const dFatal = d.fatal / 100

    // d.isolated is possible undefined
    const isolated = d.isolated ?? 0
    hospitalizedFrac += freq * dHospital
    criticalFracHospitalized += freq * dCritical
    fatalFracCritical += freq * dFatal
    avgIsolatedFrac += (freq * isolated) / 100

    // Age specific rates
    pop.isolatedFrac[d.ageGroup] = isolated / 100
    pop.recoveryRate[d.ageGroup] = (1 - dHospital) / params.infectiousPeriod
    pop.hospitalizedRate[d.ageGroup] = dHospital / params.infectiousPeriod
    pop.dischargeRate[d.ageGroup] = (1 - dCritical) / params.lengthHospitalStay
    pop.criticalRate[d.ageGroup] = dCritical / params.lengthHospitalStay
    pop.stabilizationRate[d.ageGroup] = (1 - dFatal) / params.lengthICUStay
    pop.deathRate[d.ageGroup] = dFatal / params.lengthICUStay
    pop.overflowDeathRate[d.ageGroup] = params.overflowSeverity * pop.deathRate[d.ageGroup]
  })

  // Get import rates per age class (assume flat)
  const L = Object.keys(pop.recoveryRate).length
  Object.keys(pop.recoveryRate).forEach((k) => {
    pop.importsPerDay[k] = params.importsPerDay / L
  })

  // Population average rates
  pop.recoveryRate.total = (1 - hospitalizedFrac) / params.infectiousPeriod
  pop.hospitalizedRate.total = hospitalizedFrac / params.infectiousPeriod
  pop.dischargeRate.total = (1 - criticalFracHospitalized) / params.lengthHospitalStay
  pop.criticalRate.total = criticalFracHospitalized / params.lengthHospitalStay
  pop.deathRate.total = fatalFracCritical / params.lengthICUStay
  pop.stabilizationRate.total = (1 - fatalFracCritical) / params.lengthICUStay
  pop.overflowDeathRate.total = (params.overflowSeverity * fatalFracCritical) / params.lengthICUStay
  pop.isolatedFrac.total = avgIsolatedFrac

  // Infectivity dynamics
  const avgInfectionRate = params.r0 / params.infectiousPeriod
  pop.infectionRate = (time: Date) =>
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
      susceptible: put(N - numCases),
      exposed: putarr(0),
      infectious: put(numCases),
      hospitalized: put(0),
      critical: put(0),
      discharged: put(0),
      recovered: put(0),
      intensive: put(0),
      dead: put(0),
      overflow: put(0),
    }
  }
  const Z = Object.values(ages).reduce((a, b) => a + b)
  const pop: SimulationTimePoint = {
    time: t0,
    susceptible: {},
    exposed: {},
    infectious: {},
    hospitalized: {},
    critical: {},
    overflow: {},
    discharged: {},
    intensive: {},
    recovered: {},
    dead: {},
  }
  // TODO: Ensure the sum is equal to N!
  Object.keys(ages).forEach((k, i) => {
    const n = Math.round((ages[k] / Z) * N)
    pop.susceptible[k] = n
    pop.exposed[k] = [0, 0, 0]
    pop.infectious[k] = 0
    pop.hospitalized[k] = 0
    pop.critical[k] = 0
    pop.overflow[k] = 0
    pop.discharged[k] = 0
    pop.recovered[k] = 0
    pop.intensive[k] = 0
    pop.dead[k] = 0
    if (i === Math.round(Object.keys(ages).length / 2)) {
      pop.susceptible[k] -= numCases
      pop.infectious[k] = 0.3 * numCases
      const e           = 0.7 * numCases / pop.exposed[k].length;
      pop.exposed[k]    = [e, e, e];
    }
  })

  return pop
}

// Grabs all keys which index into a Record<string, number> object
type NumberRecordKeys<T> = { [K in keyof T]: Record<string, number> extends T[K] ? K : never }[keyof T]
type NumberArrayRecordKeys<T> = { [K in keyof T]: Record<string, number[]> extends T[K] ? K : never }[keyof T]

// NOTE: Assumes all subfields corresponding to populations have the same set of keys
export function evolve(pop: SimulationTimePoint, P: ModelParams, sample: (x: number) => number): SimulationTimePoint {
  const sum = (dict: Record<string, number>): number => {
    return Object.values(dict).reduce((a, b) => a + b, 0)
  }
  const fracInfected = sum(pop.infectious) / P.populationServed

  const newTime = new Date(pop.time + P.timeDelta)
  const newPop: SimulationTimePoint = {
    time: newTime.valueOf(),
    susceptible: {},
    exposed: {},
    infectious: {},
    recovered: {},
    hospitalized: {},
    critical: {},
    overflow: {},
    discharged: {},
    intensive: {},
    dead: {},
  }

  const push = <Sub extends NumberRecordKeys<SimulationTimePoint>>(sub: Sub, age: string, delta: number) => {
    // To get TS to type check this function, we need first assign newPop[sub] to Record<string, number>
    // There is possibly a better solution
    const record: Record<string, number> = newPop[sub]
    record[age] = pop[sub][age] + delta
  }

  const pushAt = <Sub extends NumberArrayRecordKeys<SimulationTimePoint>>(sub: Sub, age: string, delta: number, index: number) => {
    // To get TS to type check this function, we need first assign newPop[sub] to Record<string, number[]>
    // There is possibly a better solution
    const record: Record<string, number[]> = newPop[sub]
    record[age][index] = pop[sub][age][index] + delta
  }

  const newCases: Record<string, number> = {}
  const newExposedFlux: Record<string, number[]> = {}
  const newRecovered: Record<string, number> = {}
  const newHospitalized: Record<string, number> = {}
  const newDischarged: Record<string, number> = {}
  const newCritical: Record<string, number> = {}
  const newStabilized: Record<string, number> = {}
  const newICUDead: Record<string, number> = {}
  const newOverflowStabilized: Record<string, number> = {}
  const newOverflowDead: Record<string, number> = {}

  // Compute all fluxes (apart from overflow states) barring no hospital bed constraints
  const Keys = Object.keys(pop.infectious).sort()
  Keys.forEach(age => {
    // Initialize all multi-faceted states with internal arrays
    newExposedFlux[age]  = []
    newPop.exposed[age] = []

    newCases[age] =
      sample(P.importsPerDay[age] * P.timeDeltaDays) +
      sample(
        (1 - P.isolatedFrac[age]) * P.infectionRate(newTime) * pop.susceptible[age] * fracInfected * P.timeDeltaDays,
      )
    // NOTE: Propagate individuals through internal exposed states
    for (let i = 0; i < pop.exposed[age].length; i++) {
        newExposedFlux[age][i] = Math.min(
            pop.exposed[age][i], 
            sample((pop.exposed[age][i] * P.timeDeltaDays) / (P.incubationTime / pop.exposed[age].length))
        )
    }
    newRecovered[age] = Math.min(
      pop.infectious[age],
      sample(pop.infectious[age] * P.timeDeltaDays * P.recoveryRate[age]),
    )
    newHospitalized[age] = Math.min(
      pop.infectious[age] - newRecovered[age],
      sample(pop.infectious[age] * P.timeDeltaDays * P.hospitalizedRate[age]),
    )
    newDischarged[age] = Math.min(
      pop.hospitalized[age],
      sample(pop.hospitalized[age] * P.timeDeltaDays * P.dischargeRate[age]),
    )
    newCritical[age] = Math.min(
      pop.hospitalized[age] - newDischarged[age],
      sample(pop.hospitalized[age] * P.timeDeltaDays * P.criticalRate[age]),
    )
    newStabilized[age] = Math.min(
      pop.critical[age],
      sample(pop.critical[age] * P.timeDeltaDays * P.stabilizationRate[age]),
    )
    newICUDead[age] = Math.min(
      pop.critical[age] - newStabilized[age],
      sample(pop.critical[age] * P.timeDeltaDays * P.deathRate[age]),
    )
    newOverflowStabilized[age] = Math.min(
      pop.overflow[age],
      sample(pop.overflow[age] * P.timeDeltaDays * P.stabilizationRate[age]),
    )
    newOverflowDead[age] = Math.min(
      pop.overflow[age] - newOverflowStabilized[age],
      sample(pop.overflow[age] * P.timeDeltaDays * P.overflowDeathRate[age]),
    )

    push('susceptible', age, -newCases[age])
    let fluxIn = newCases[age];
    for (let i = 0; i < newExposedFlux[age].length; i++) {
        pushAt('exposed', age, fluxIn - newExposedFlux[age][i], i)
        fluxIn = newExposedFlux[age][i];
    }
    push('infectious', age, fluxIn - newRecovered[age] - newHospitalized[age])
    push(
      'hospitalized',
      age,
      newHospitalized[age] + newStabilized[age] + newOverflowStabilized[age] - newDischarged[age] - newCritical[age],
    )
    // Cumulative categories
    push('recovered', age, newRecovered[age] + newDischarged[age])
    push('intensive', age, newCritical[age])
    push('discharged', age, newDischarged[age])
    push('dead', age, newICUDead[age] + newOverflowDead[age])
  })

  // Move hospitalized patients according to constrained resources
  let freeICUBeds = P.ICUBeds - (sum(pop.critical) - sum(newStabilized) - sum(newICUDead))
  Keys.forEach((age) => {
    if (freeICUBeds > newCritical[age]) {
      freeICUBeds -= newCritical[age]
      push('critical', age, newCritical[age] - newStabilized[age] - newICUDead[age])
      push('overflow', age, -newOverflowDead[age] - newOverflowStabilized[age])
    } else if (freeICUBeds > 0) {
      const newOverflow = newCritical[age] - freeICUBeds
      push('critical', age, freeICUBeds - newStabilized[age] - newICUDead[age])
      push('overflow', age, newOverflow - newOverflowDead[age] - newOverflowStabilized[age])
      freeICUBeds = 0
    } else {
      push('critical', age, -newStabilized[age] - newICUDead[age])
      push('overflow', age, newCritical[age] - newOverflowDead[age] - newOverflowStabilized[age])
    }
  })

  // If any overflow patients are left AND there are free beds, move them back.
  // Again, move w/ lower age as priority.
  for (let i = 0; freeICUBeds > 0 && i < Keys.length; i++) {
    const age = Keys[i]
    if (newPop.overflow[age] < freeICUBeds) {
      newPop.critical[age] += newPop.overflow[age]
      freeICUBeds -= newPop.overflow[age]
      newPop.overflow[age] = 0
    } else {
      newPop.critical[age] += freeICUBeds
      newPop.overflow[age] -= freeICUBeds
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

export function collectTotals(trajectory: SimulationTimePoint[]) : UserResult {
  // FIXME: parameter reassign
  const res: UserResult = { 'trajectory': [] }

  trajectory.forEach(d => {
    const tp : ExportedTimePoint = {
        "time": d["time"],
        "susceptible": {},
        "exposed": {},
        "dead": {},
        "overflow": {},
        "critical": {},
        "recovered": {},
        "hospitalized": {},
        "infectious": {},
        "discharged": {},
        "intensive": {}
    };
    keys(d).forEach(k => {
      switch (k)  {
        case 'time': 
          return

        case 'exposed':
          tp[k].total = 0
          Object.values(d[k]).forEach((x) => { 
              x.forEach((y) => {tp[k].total += y
              })
          })
          Object.keys(d[k]).forEach((a) => {
              tp[k][a] = d[k][a].reduce((a, b) => a + b, 0)
          })
          break

        default:
          tp[k] = d[k]
          tp[k].total = Object.values(d[k]).reduce((a, b) => a + b)
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

  const header = keys(result.trajectory[0])
  const csv = [header.join('\t')]

  const pop: Record<string, boolean> = {}
  result.trajectory.forEach(d => {
    const t = new Date(d.time).toISOString().slice(0, 10)
    if (t in pop) {
      return
    } // skip if date is already in table
    pop[t] = true
    let buf = ''
    header.forEach((k) => {
      if (k === 'time') {
        buf += `${t}`
      } else {
        buf += `\t${Math.round(d[k].total)}`
      }
    })
    csv.push(buf)
  })

  return csv.join('\n')
}
