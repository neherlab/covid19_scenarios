import * as math from 'mathjs'

import { OneCountryAgeDistribution } from '../assets/data/CountryAgeDistribution.types'

import { SeverityTableRow } from '../components/Main/Scenario/SeverityTable'

import { collectTotals, evolve, getPopulationParams, initializePopulation } from './model'
import { AllParamsFlat } from './types/Param.types'
import { AlgorithmResult, SimulationTimePoint, ExportedTimePoint } from './types/Result.types'
import { TimeSeries } from './types/TimeSeries.types'

const identity = (x: number) => x
const poisson = (x: number) => {
  throw new Error('We removed dependency on `random` package. Currently `poisson` is not implemented')
}

// NOTE: Assumes containment is sorted ascending in time.
export function interpolateTimeSeries(containment: TimeSeries): (t: Date) => number {
  if (containment.length === 0) {
    throw new Error('Containment cannot be empty')
  }

  const Ys = containment.map((d) => d.y)
  const Ts = containment.map((d) => Number(d.t))

  /* All needed linear algebra functions */
  type Vector = number[]
  type Matrix = number[][]

  const getSmoothDerivatives = function (): Vector {
    // Solve for the derivatives that lead to "smoothest" interpolator
    const Mtx: Matrix = []
    const Vec: Vector = []
    for (let i = 0; i < Ys.length; i++) {
      Mtx.push([])
      for (let j = 0; j < Ys.length; j++) {
        Mtx[i].push(0)
      }
      Vec.push(0)
    }

    const n = Mtx.length

    for (let i = 1; i < n - 1; i++) {
      Mtx[i][i - 1] = 1 / (Ts[i] - Ts[i - 1])
      Mtx[i][i] = 2 * (1 / (Ts[i] - Ts[i - 1]) + 1 / (Ts[i + 1] - Ts[i]))
      Mtx[i][i + 1] = 1 / (Ts[i + 1] - Ts[i])
      Vec[i] =
        3 *
        ((Ys[i] - Ys[i - 1]) / ((Ts[i] - Ts[i - 1]) * (Ts[i] - Ts[i - 1])) +
          (Ys[i + 1] - Ys[i]) / ((Ts[i + 1] - Ts[i]) * (Ts[i + 1] - Ts[i])))
    }

    Mtx[0][0] = 2 / (Ts[1] - Ts[0])
    Mtx[0][1] = 1 / (Ts[1] - Ts[0])
    Vec[0] = (3 * (Ys[1] - Ys[0])) / ((Ts[1] - Ts[0]) * (Ts[1] - Ts[0]))

    Mtx[n - 1][n - 2] = 1 / (Ts[n - 1] - Ts[n - 2])
    Mtx[n - 1][n - 1] = 2 / (Ts[n - 1] - Ts[n - 2])
    Vec[n - 1] = (3 * (Ys[n - 1] - Ys[n - 2])) / ((Ts[n - 1] - Ts[n - 2]) * (Ts[n - 1] - Ts[n - 2]))

    const A = math.matrix(Mtx)
    const x = math.multiply(math.inv(A), Vec)

    return x.toArray()
  }

  const Yps = getSmoothDerivatives()

  return (t: Date) => {
    if (t <= containment[0].t) {
      return containment[0].y
    }
    if (t >= containment[containment.length - 1].t) {
      return containment[containment.length - 1].y
    }
    const i = containment.findIndex((d) => Number(t) < Number(d.t))

    // Eval spline will return the function value @ t, fit to a spline
    // Requires the containment strengths (ys) and derivatives (yps) and times (ts)
    const eval_spline = (t: number) => {
      const f = (t - Ts[i - 1]) / (Ts[i] - Ts[i - 1])
      const a = +Yps[i - 1] * (Ts[i] - Ts[i - 1]) - (Ys[i] - Ys[i - 1])
      const b = -Yps[i] * (Ts[i] - Ts[i - 1]) + (Ys[i] - Ys[i - 1])
      return (1 - f) * Ys[i - 1] + f * Ys[i] + f * (1 - f) * (a * (1 - f) + b * f)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const eval_linear = (t: number) => {
      const deltaY = Ys[i] - Ys[i - 1]
      const deltaT = Ts[i] - Ts[i - 1]

      const dS = deltaY / deltaT
      const dT = t - Ts[i - 1]

      return Ys[i - 1] + dS * dT
    }

    return eval_spline(Number(t))
  }
}

/**
 *
 * Entry point for the algorithm
 *
 */
export default async function run(
  params: AllParamsFlat,
  severity: SeverityTableRow[],
  ageDistribution: OneCountryAgeDistribution,
  containment: TimeSeries,
): Promise<AlgorithmResult> {
  // ----------------------------------
  // Internal functions
  // TODO(nnoll): This is rather hacky right now
  function sumTimePoint(x: ExportedTimePoint, y: ExportedTimePoint, func: (x: number) => number) {
    const sum = (dict: Record<string, number>, other: Record<string, number>): Record<string, number> => {
      const s: Record<string, number> = {}
      Object.keys(other).forEach((k) => {
        if (!(k in dict)) {
          s[k] = func(other[k])
        } else {
          s[k] = dict[k] + func(other[k])
        }
      })

      return s
    }
    const z: ExportedTimePoint = {
      time: y.time,
      current: {
        susceptible: sum(x.current.susceptible, y.current.susceptible),
        severe: sum(x.current.severe, y.current.severe),
        exposed: sum(x.current.exposed, y.current.exposed),
        critical: sum(x.current.critical, y.current.critical),
        overflow: sum(x.current.overflow, y.current.overflow),
        infectious: sum(x.current.infectious, y.current.infectious),
      },
      cumulative: {
        critical: sum(x.cumulative.critical, y.cumulative.critical),
        fatality: sum(x.cumulative.fatality, y.cumulative.fatality),
        recovered: sum(x.cumulative.recovered, y.cumulative.recovered),
        hospitalized: sum(x.cumulative.hospitalized, y.cumulative.hospitalized),
      },
    }

    return z
  }

  function zeros(len: number): ExportedTimePoint[] {
    const arr: ExportedTimePoint[] = []
    while (arr.length < len) {
      arr.push({
        time: Date.now(), // Dummy
        current: {
          susceptible: {},
          severe: {},
          critical: {},
          exposed: {},
          infectious: {},
          overflow: {},
        },
        cumulative: {
          recovered: {},
          critical: {},
          hospitalized: {},
          fatality: {},
        },
      })
    }
    return arr
  }

  // ----------------------------------
  // Body
  const tMin: number = new Date(params.simulationTimeRange.tMin).getTime()
  const tMax: number = new Date(params.simulationTimeRange.tMax).getTime()
  const initialCases = params.suspectedCasesToday
  const modelParamsArray = getPopulationParams(params, severity, ageDistribution, interpolateTimeSeries(containment))

  // TODO(nnoll): Better naming required here
  const msPerDay = 24 * 60 * 60 * 1000
  const numDaysDelta = Math.round((tMax - tMin) / msPerDay)
  const avgLinear: ExportedTimePoint[] = zeros(numDaysDelta)
  const avgSquare: ExportedTimePoint[] = zeros(numDaysDelta)

  modelParamsArray.forEach((modelParams) => {
    const population = initializePopulation(modelParams.populationServed, initialCases, tMin, ageDistribution)

    function simulate(initialState: SimulationTimePoint, func: (x: number) => number): ExportedTimePoint[] {
      let currState = Object.assign({}, initialState)
      const dynamics = [currState]
      while (currState.time < tMax) {
        currState = evolve(currState, modelParams, currState.time + 1, func)
        dynamics.push(currState)
      }

      return collectTotals(dynamics)
    }

    const realization = simulate(population, identity)

    avgLinear.forEach((tp, i) => {
      avgLinear[i] = sumTimePoint(tp, realization[i], (x) => {
        return x / modelParamsArray.length
      })
    })

    avgSquare.forEach((tp, i) => {
      avgSquare[i] = sumTimePoint(tp, realization[i], (x) => {
        return (x * x) / modelParamsArray.length
      })
    })
  })

  console.log('AVERAGE LINEAR', avgLinear)
  console.log('AVERAGE SQUARE', avgSquare)

  // Convert squared average to variance
  const variance = avgSquare.map((tp, i) => {
    return sumTimePoint(tp, avgLinear[i], (x: number) => {
      return -x * x
    })
  })

  console.log('VARIANCE', variance)

  const result: AlgorithmResult = {
    trajectory: {
      mean: avgLinear,
      variance: variance,
    },
    params: modelParamsArray,
  }

  return result
}
