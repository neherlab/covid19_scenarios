import { AgeDistributionDatum, ScenarioFlat, SeverityDistributionDatum } from './types/Param.types'
import { AlgorithmResult, SimulationTimePoint, ExportedTimePoint } from './types/Result.types'

import { getPopulationParams, initializePopulation } from './initialize'
import { collectTotals, evolve } from './model'
import { percentileTrajectory } from './results'
import { preparePlotData } from './preparePlotData'

const identity = (x: number) => x

export interface RunParams {
  params: ScenarioFlat
  severity: SeverityDistributionDatum[]
  ageDistribution: AgeDistributionDatum[]
}

export async function run({ params, severity, ageDistribution }: RunParams): Promise<AlgorithmResult> {
  const tMin: number = new Date(params.simulationTimeRange.begin).getTime()
  const tMax: number = new Date(params.simulationTimeRange.end).getTime()
  const ageGroups = ageDistribution.map((d) => d.ageGroup)
  const initialCases = params.initialNumberOfCases

  const modelParamsArray = getPopulationParams(params, severity, ageDistribution, false)
  modelParamsArray.push(...getPopulationParams(params, severity, ageDistribution, true))

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
        .slice(0, -1)
        .map((ModelParams) => ModelParams.rate.infection(d.time) * params.infectiousPeriodDays)
        .sort((a, b) => a - b),
    }
  })

  const meanTrajectory = trajectories[trajectories.length - 1]
  const stochasticTrajectories = trajectories.slice(0, -1)
  const meanR0Trajectory = meanTrajectory.map((d) => {
    return {
      t: d.time,
      y: modelParamsArray[modelParamsArray.length - 1].rate.infection(d.time) * params.infectiousPeriodDays,
    }
  })
  const resultsTrajectory = {
    lower: percentileTrajectory(trajectories, 0.2),
    middle: percentileTrajectory(trajectories, 0.5),
    upper: percentileTrajectory(trajectories, 0.8),
    percentile: {},
  }
  return {
    trajectory: resultsTrajectory,
    R0: {
      mean: meanR0Trajectory,
      lower: R0Trajectories.map((d) => ({ t: d.t, y: d.y[idxs[0]] })),
      upper: R0Trajectories.map((d) => ({ t: d.t, y: d.y[idxs[2]] })),
    },
    plotData: preparePlotData(resultsTrajectory),
  }
}
