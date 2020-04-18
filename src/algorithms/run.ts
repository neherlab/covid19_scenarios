import { AgeDistribution, Severity } from '../.generated/types'
import { AllParamsFlat } from './types/Param.types'
import { AlgorithmResult, SimulationTimePoint, ExportedTimePoint } from './types/Result.types'

import { getPopulationParams, initializePopulation } from './initialize'
import { collectTotals, evolve } from './model'
import { mulTP, divTP, meanTrajectory, stddevTrajectory } from './results'

const identity = (x: number) => x

// -----------------------------------------------------------------------
// Main function

/**
 *
 * Entry point for the algorithm
 *
 */
export async function run(
  params: AllParamsFlat,
  severity: Severity[],
  ageDistribution: AgeDistribution,
): Promise<AlgorithmResult> {
  const tMin: number = new Date(params.simulationTimeRange.tMin).getTime()
  const tMax: number = new Date(params.simulationTimeRange.tMax).getTime()
  const ageGroups = Object.keys(ageDistribution)
  const initialCases = params.initialNumberOfCases

  const modelParamsArray = getPopulationParams(params, severity, ageDistribution)

  const trajectories: ExportedTimePoint[][] = []

  modelParamsArray.forEach((modelParams) => {
    const population = initializePopulation(modelParams.populationServed, initialCases, tMin, ageDistribution)
    function simulate(initialState: SimulationTimePoint, func: (x: number) => number): ExportedTimePoint[] {
      const dynamics = [initialState]
      let currState = initialState

      while (currState.time < tMax) {
        currState = evolve(currState, modelParams, currState.time + 1, func)
        dynamics.push(currState)
      }

      return collectTotals(dynamics, ageGroups)
    }
    const trajectory = simulate(population, identity)
    trajectories.push(trajectory)
  })

  const mean = meanTrajectory(trajectories)
  const sdev = stddevTrajectory(trajectories, mean)

  const R0Trajectories = trajectories[0].map((d) => {
    return {
      t: d.time,
      y: modelParamsArray.map((ModelParams) => ModelParams.rate.infection(d.time) * params.infectiousPeriod),
    }
  })

  const meanR0 = R0Trajectories.map((d) => {
    return { t: d.t, y: d.y.reduce((a, b) => a + b, 0) / d.y.length }
  })

  const secondMomentR0 = R0Trajectories.map((d) => {
    return { t: d.t, y: d.y.reduce((a, b) => a + b * b, 0) / d.y.length }
  })

  const stdR0 = secondMomentR0.map((d, i) => {
    return { t: d.t, y: Math.sqrt(d.y - meanR0[i].y * meanR0[i].y) }
  })

  return {
    trajectory: {
      mean,
      upper: mean.map((m, i) => mulTP(m, sdev[i])),
      lower: mean.map((m, i) => divTP(m, sdev[i])),
      percentile: {},
    },
    R0: {
      mean: meanR0,
      lower: meanR0.map((m, i) => {
        return { t: m.t, y: m.y - stdR0[i].y }
      }),
      upper: meanR0.map((m, i) => {
        return { t: m.t, y: m.y + stdR0[i].y }
      }),
    },
  }
}
