import { cloneDeep } from 'lodash'
import { SeverityTableRow } from '../components/Main/Scenario/SeverityTable'

import { AgeDistribution } from '../.generated/types'
import { TimeSeries } from './types/TimeSeries.types'
import { AllParamsFlat, MitigationIntervals } from './types/Param.types'
import { ModelParams, SimulationTimePoint } from './types/Result.types'

// -----------------------------------------------------------------------
// Utility functions

interface ChangePoint {
  t: Date
  val: number[]
}

const compareTimes = (a: ChangePoint, b: ChangePoint): number => {
  return a.t.valueOf() - b.t.valueOf()
}

function intervalsToTimeSeries(intervals: MitigationIntervals): TimeSeries {
  const changePoints = {}
  intervals.forEach((element) => {
    // bound the value by 0.01 and 100 (transmission can be at most 100 fold reduced or increased)
    const val = Math.min(Math.max(1 - element.mitigationValue[0] * 0.01, 0.01), 100)

    if (changePoints[element.timeRange.tMin] !== undefined) {
      changePoints[element.timeRange.tMin].push(val)
    } else {
      changePoints[element.timeRange.tMin] = [val]
    }
    // add inverse of the value when measure is relaxed
    if (changePoints[element.timeRange.tMax] !== undefined) {
      changePoints[element.timeRange.tMax].push(1.0 / val)
    } else {
      changePoints[element.timeRange.tMax] = [1.0 / val]
    }
  })

  const orderedChangePoints: ChangePoint[] = Object.keys(changePoints).map((d) => ({
    t: new Date(d),
    val: changePoints[d],
  }))

  orderedChangePoints.sort(compareTimes)

  if (orderedChangePoints.length) {
    const mitigationSeries: TimeSeries = [{ t: orderedChangePoints[0].t, y: 1.0 }]
    const product = (a: number, b: number): number => a * b

    orderedChangePoints.forEach((d, i) => {
      const prevValue = mitigationSeries[2 * i].y
      const newValue = d.val.reduce(product, prevValue)
      mitigationSeries.push({ t: d.t, y: prevValue })
      mitigationSeries.push({ t: d.t, y: newValue })
    })
    return mitigationSeries
  }
  return []
}
// NOTE: Assumes containment is sorted ascending in time.
function interpolateTimeSeries(containment: TimeSeries): (t: Date) => number {
  if (containment.length === 0) {
    return () => 1.0
  }

  const Ys = containment.map((d) => d.y)
  const Ts = containment.map((d) => Number(d.t))
  return (t: Date) => {
    if (t <= containment[0].t) {
      return containment[0].y
    }
    if (t >= containment[containment.length - 1].t) {
      return containment[containment.length - 1].y
    }
    const i = containment.findIndex((d) => Number(t) < Number(d.t))

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const evalLinear = (t: number) => {
      const deltaY = Ys[i] - Ys[i - 1]
      const deltaT = Ts[i] - Ts[i - 1]

      const dS = deltaY / deltaT
      const dT = t - Ts[i - 1]

      return Ys[i - 1] + dS * dT
    }

    return evalLinear(Number(t))
  }
}

// -----------------------------------------------------------------------
// Globals

const monthToDay = (m: number) => {
  return m * 30 + 15
}
const jan2020 = new Date('2020-01-01').valueOf() // time in ms
export const msPerDay = 1000 * 60 * 60 * 24

// -----------------------------------------------------------------------
// Exported functions

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

// TODO(nnoll): Make a user-adjustable parameter?
const NUMBER_PARAMETER_SAMPLES = 10

export function getPopulationParams(
  params: AllParamsFlat,
  severity: SeverityTableRow[],
  ageCounts: AgeDistribution,
): ModelParams[] {
  // TODO: Make this a form-adjustable factor
  const sim: ModelParams = {
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
  const containment = interpolateTimeSeries(intervalsToTimeSeries(params.mitigationIntervals))
  if (params.r0[0] == params.r0[1]) {
    const avgInfectionRate = params.r0[0] / params.infectiousPeriod
    sim.rate.infection = (time: Date) =>
      containment(time) * infectionRate(time.valueOf(), avgInfectionRate, params.peakMonth, params.seasonalForcing)

    return [sim]
  }
  // TODO(nnoll): Generalize to allow for sampling multiple uncertainty ranges
  const sample_uniform = (range: [number, number], npoints: number): number[] => {
    const sample: number[] = []
    const delta = (range[1] - range[0]) / npoints
    let val = range[0]
    while (sample.length < npoints) {
      sample.push(val)
      val += delta
    }
    return sample
  }

  const r0s = sample_uniform(params.r0 as [number, number], NUMBER_PARAMETER_SAMPLES)
  return r0s.map((r0) => {
    const elt = cloneDeep(sim)
    const avg_infection_rate = r0 / params.infectiousPeriod

    elt.rate.infection = (time: Date) =>
      containment(time) * infectionRate(time.valueOf(), avg_infection_rate, params.peakMonth, params.seasonalForcing)

    return elt
  })
}

export function initializePopulation(
  N: number,
  numCases: number,
  t0: number,
  ages: Record<string, number>,
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
  const ageGroups = Object.keys(ages).sort()
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
