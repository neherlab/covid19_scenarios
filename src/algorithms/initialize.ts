import { cloneDeep } from 'lodash'
import { AgeDistribution, Severity } from '../.generated/types'
import { AllParamsFlat } from './types/Param.types'
import { ModelParams, SimulationTimePoint } from './types/Result.types'

import { sampleUniform } from './utils/sample'
import { containmentMeasures } from './mitigation'

const monthToDay = (m: number) => {
  return m * 30 + 15
}

const jan2020 = new Date('2020-01-01').valueOf() // time in ms

export const msPerDay = 1000 * 60 * 60 * 24

function sortEntriesByKey<ValueType>([key1]: [string, ValueType], [key2]: [string, ValueType]) {
  if (key1 > key2) {
    return 1
  }
  if (key1 < key2) {
    return -1
  }
  return 0
}

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
  severity: Severity[],
  ageCounts: AgeDistribution,
): ModelParams[] {
  // TODO: Make this a form-adjustable factor
  const sim: ModelParams = {
    ageDistribution: {
      '0-9': 0,
      '10-19': 0,
      '20-29': 0,
      '30-39': 0,
      '40-49': 0,
      '50-59': 0,
      '60-69': 0,
      '70-79': 0,
      '80+': 0,
    },
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
  const total = severity.map((d) => d.ageGroup).reduce((a, b) => a + ageCounts[b], 0)

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
    const freq = (1.0 * ageCounts[row.ageGroup]) / total
    sim.ageDistribution[row.ageGroup] = freq
    sim.frac.severe[i] = (row.severe / 100) * (row.confirmed / 100)
    sim.frac.critical[i] = sim.frac.severe[i] * (row.critical / 100)
    sim.frac.fatal[i] = sim.frac.critical[i] * (row.fatal / 100)

    const dHospital = sim.frac.severe[i]
    const dCritical = row.critical / 100
    const dFatal = row.fatal / 100

    // d.isolated is possible undefined
    const isolated = row.isolated ?? 0

    // Age specific rates
    sim.frac.isolated[i] = isolated / 100
    sim.rate.recovery[i] = (1 - dHospital) / params.infectiousPeriod
    sim.rate.severe[i] = dHospital / params.infectiousPeriod
    sim.rate.discharge[i] = (1 - dCritical) / params.lengthHospitalStay
    sim.rate.critical[i] = dCritical / params.lengthHospitalStay
    sim.rate.stabilize[i] = (1 - dFatal) / params.lengthICUStay
    sim.rate.fatality[i] = dFatal / params.lengthICUStay
    sim.rate.overflowFatality[i] = params.overflowSeverity * sim.rate.fatality[i]
  })

  // Get import rates per age class (assume flat)
  const L = Object.keys(sim.rate.recovery).length
  sim.rate.recovery.forEach((_, i) => {
    sim.importsPerDay[i] = params.importsPerDay / L
  })

  // Infectivity dynamics
  // interpolateTimeSeries(intervalsToTimeSeries(params.mitigationIntervals))
  const containmentRealization = containmentMeasures(params.mitigationIntervals, params.numberStochasticRuns)
  if (params.r0[0] === params.r0[1] && containmentRealization.length === 1) {
    const avgInfectionRate = params.r0[0] / params.infectiousPeriod
    sim.rate.infection = (time: number) =>
      containmentRealization[0](time) * infectionRate(time, avgInfectionRate, params.peakMonth, params.seasonalForcing)

    return [sim]
  }

  const r0s = sampleUniform([params.r0[0], params.r0[1]], params.numberStochasticRuns)
  return r0s.map((r0, i) => {
    const elt = cloneDeep(sim)
    const avgInfectionRate = r0 / params.infectiousPeriod

    const containment = containmentRealization.length > 1 ? containmentRealization[i] : containmentRealization[0]
    elt.rate.infection = (time: number) =>
      containment(time) * infectionRate(time, avgInfectionRate, params.peakMonth, params.seasonalForcing)

    return elt
  })
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
      infectious: [],
    },
  }

  // specification of the initial condition: there are numCases at tMin
  // of those, 0.3 are infectious, the remainder is exposed and will turn
  // infectious as they propagate through the exposed categories.
  const initialInfectiousFraction = 0.3

  // TODO: Ensure the sum is equal to N!
  const ageGroups = Object.entries(ages).sort(sortEntriesByKey)
  ageGroups.forEach(([_0, populationOfThisAge], i) => {
    const n = Math.round((populationOfThisAge / Z) * N)
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
      pop.cumulative.infectious[i] = pop.current.infectious[i]
      const e = ((1 - initialInfectiousFraction) * numCases) / pop.current.exposed[i].length
      pop.current.exposed[i] = pop.current.exposed[i].map((_) => e)
    }
  })

  return pop
}
