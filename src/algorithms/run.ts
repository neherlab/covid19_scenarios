import { AgeDistributionDatum, ScenarioFlat, SeverityDistributionDatum } from './types/Param.types'
import { AlgorithmResult, SimulationTimePoint, ExportedTimePoint } from './types/Result.types'

import { getPopulationParams, initializePopulation } from './initialize'
import { collectTotals, evolve } from './model'
import { percentileTrajectory } from './results'

const identity = (x: number) => x

export interface RunParams {
  params: ScenarioFlat
  severity: SeverityDistributionDatum[]
  ageDistribution: AgeDistributionDatum[]
}

export async function run({ params, severity, ageDistribution }: RunParams): Promise<AlgorithmResult> {
  const tMin: number = new Date(params.simulationTimeRange.begin).getTime()
  const tMax: number = new Date(params.simulationTimeRange.end).getTime()
  const ageGroups = Object.keys(ageDistribution)
  const initialCases = params.initialNumberOfCases

  const modelParamsArray = getPopulationParams(params, severity, ageDistribution)

  const trajectories = modelParamsArray.map((modelParams) => {
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
    return simulate(population, identity)
  })

  // const mean = meanTrajectory(trajectories)
  // const sdev = stddevTrajectory(trajectories, mean)

  const thresholds = [0.2, 0.5, 0.8]
  const idxs = thresholds.map((d) => Math.ceil((trajectories.length - 1) * d))
  const R0Trajectories = trajectories[0].map((d) => {
    return {
      t: d.time,
      y: modelParamsArray
        .map((ModelParams) => ModelParams.rate.infection(d.time) * params.infectiousPeriodDays)
        .sort((a, b) => a - b),
    }
  })

  return {
    trajectory: {
      lower: percentileTrajectory(trajectories, 0.2),
      middle: percentileTrajectory(trajectories, 0.5),
      upper: percentileTrajectory(trajectories, 0.8),
      // middle: mean,
      // upper: mean.map((m, i) => mulTP(m, sdev[i])),
      // lower: mean.map((m, i) => divTP(m, sdev[i])),
      percentile: {},
    },
    R0: {
      mean: R0Trajectories.map((d) => ({ t: d.t, y: d.y[idxs[1]] })),
      lower: R0Trajectories.map((d) => ({ t: d.t, y: d.y[idxs[0]] })),
      upper: R0Trajectories.map((d) => ({ t: d.t, y: d.y[idxs[2]] })),
    },
  }
}
