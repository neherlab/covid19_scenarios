import { cloneDeep, sumBy } from 'lodash'
import { containmentMeasures } from './mitigation'
import { AgeDistributionDatum, AgeGroup, ScenarioFlat, SeverityDistributionDatum } from './types/Param.types'
import { ModelParams, SimulationTimePoint } from './types/Result.types'

import { sampleUniform } from './utils/sample'

const monthToDay = (m: number) => {
  return m * 30 + 15
}

const jan2020 = new Date('2020-01-01').valueOf() // time in ms

export function withUncertainty(scenario: ScenarioFlat): boolean {
  const noRanges = scenario.mitigationIntervals.every(
    (interval) => interval.transmissionReduction.begin === interval.transmissionReduction.end,
  )
  if (scenario.r0.begin === scenario.r0.end && noRanges) {
    return false
  }
  return true
}

export const msPerDay = 1000 * 60 * 60 * 24

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
  scenario: ScenarioFlat,
  severity: SeverityDistributionDatum[],
  ageDistribution: AgeDistributionDatum[],
  meanOnly: boolean,
): ModelParams[] {
  const {
    hospitalBeds,
    hospitalStayDays,
    icuBeds,
    icuStayDays,
    importsPerDay,
    infectiousPeriodDays,
    latencyDays,
    mitigationIntervals,
    numberStochasticRuns,
    overflowSeverity,
    peakMonth,
    populationServed,
    r0,
    seasonalForcing,
  } = scenario

  // TODO: Make this a form-adjustable factor
  const sim: ModelParams = {
    ageDistribution: [
      { ageGroup: AgeGroup.The09, population: 0 },
      { ageGroup: AgeGroup.The1019, population: 0 },
      { ageGroup: AgeGroup.The2029, population: 0 },
      { ageGroup: AgeGroup.The3039, population: 0 },
      { ageGroup: AgeGroup.The4049, population: 0 },
      { ageGroup: AgeGroup.The5059, population: 0 },
      { ageGroup: AgeGroup.The6069, population: 0 },
      { ageGroup: AgeGroup.The7079, population: 0 },
      { ageGroup: AgeGroup.The80, population: 0 },
    ],
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
      latency: 1 / latencyDays,
      infection: () => -Infinity, // Dummy infectionRate function. This is set below.
      recovery: [],
      severe: [],
      discharge: [],
      critical: [],
      stabilize: [],
      fatality: [],
      overflowFatality: [],
    },

    populationServed,
    numberStochasticRuns,
    hospitalBeds,
    icuBeds,
  }

  const total = sumBy(ageDistribution, ({ population }) => population)

  severity.forEach(({ ageGroup, confirmed, critical, isolated, fatal, severe }, i) => {
    const freq = (1.0 * ageDistribution[i].population) / total
    sim.ageDistribution[i].population = freq
    sim.frac.severe[i] = (severe / 100) * (confirmed / 100)
    sim.frac.critical[i] = sim.frac.severe[i] * (critical / 100)
    sim.frac.fatal[i] = sim.frac.critical[i] * (fatal / 100)

    const dHospital = sim.frac.severe[i]
    const dCritical = critical / 100
    const dFatal = fatal / 100

    // Age specific rates
    sim.frac.isolated[i] = isolated / 100
    sim.rate.recovery[i] = (1 - dHospital) / infectiousPeriodDays
    sim.rate.severe[i] = dHospital / infectiousPeriodDays
    sim.rate.discharge[i] = (1 - dCritical) / hospitalStayDays
    sim.rate.critical[i] = dCritical / hospitalStayDays
    sim.rate.stabilize[i] = (1 - dFatal) / icuStayDays
    sim.rate.fatality[i] = dFatal / icuStayDays
    sim.rate.overflowFatality[i] = overflowSeverity * sim.rate.fatality[i]
  })

  // Get import rates per age class (assume flat)
  const L = Object.keys(sim.rate.recovery).length
  sim.rate.recovery.forEach((_, i) => {
    sim.importsPerDay[i] = importsPerDay / L
  })

  // Infectivity dynamics
  // interpolateTimeSeries(intervalsToTimeSeries(params.mitigationIntervals))
  const containmentRealization = containmentMeasures(mitigationIntervals, numberStochasticRuns, meanOnly)

  const r0s = meanOnly ? [0.5 * (r0.begin + r0.end)] : sampleUniform(r0, numberStochasticRuns)
  return r0s.map((tmpR0, i) => {
    const elt = cloneDeep(sim)
    const avgInfectionRate = tmpR0 / infectiousPeriodDays

    const containment = containmentRealization.length > 1 ? containmentRealization[i] : containmentRealization[0]
    elt.rate.infection = (time: number) =>
      containment(time) * infectionRate(time, avgInfectionRate, peakMonth, seasonalForcing)

    return elt
  })
}

export function initializePopulation(
  N: number,
  numCases: number,
  t0: number,
  ageDistribution: AgeDistributionDatum[],
): SimulationTimePoint {
  const Z = sumBy(ageDistribution, ({ population }) => population)
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

  ageDistribution.forEach(({ population }, i) => {
    const n = Math.round((population / Z) * N)
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

    if (i === Math.round(ageDistribution.length / 2)) {
      pop.current.susceptible[i] -= numCases
      pop.current.infectious[i] = initialInfectiousFraction * numCases
      const e = ((1 - initialInfectiousFraction) * numCases) / pop.current.exposed[i].length
      pop.current.exposed[i] = pop.current.exposed[i].map((_) => e)
    }
  })

  return pop
}
