import { AgeGroup } from '../.generated/latest/types'
import { AgeDistributionDatum, ScenarioFlat, SeverityDistributionDatum } from './types/Param.types'
import { AlgorithmResult, SimulationTimePoint, ExportedTimePoint, ModelParams } from './types/Result.types'

import { getPopulationParams, initializePopulation, withUncertainty } from './initialize'
import { collectTotals, evolve } from './model'
import { percentileTrajectory } from './results'
import { preparePlotData } from './preparePlotData'

const identity = (x: number) => x

export interface RunParams {
  params: ScenarioFlat
  severity: SeverityDistributionDatum[]
  ageDistribution: AgeDistributionDatum[]
}

function simulate(
  initialState: SimulationTimePoint,
  params: ModelParams,
  tMax: number,
  ageGroups: AgeGroup[],
  func: (x: number) => number,
): ExportedTimePoint[] {
  const dynamics = [initialState]
  let currState = initialState

  while (currState.time < tMax) {
    currState = evolve(currState, params, currState.time + 1, func)
    dynamics.push(currState)
  }

  return collectTotals(dynamics, ageGroups)
}

export async function run({ params, severity, ageDistribution }: RunParams): Promise<AlgorithmResult> {
  const tMin: number = new Date(params.simulationTimeRange.begin).getTime()
  const tMax: number = new Date(params.simulationTimeRange.end).getTime()
  const ageGroups = ageDistribution.map((d) => d.ageGroup)
  const initialCases = params.initialNumberOfCases

  const stochastic = withUncertainty(params)

  let stochasticTrajectories: ExportedTimePoint[][] = []
  let stochasticParams: ModelParams[] = []
  if (stochastic) {
    stochasticParams = getPopulationParams(params, severity, ageDistribution, false)
    stochasticTrajectories = stochasticParams.map((modelParams) => {
      const tmpPopulation = initializePopulation(modelParams.populationServed, initialCases, tMin, ageDistribution)
      return simulate(tmpPopulation, modelParams, tMax, ageGroups, identity)
    })
  }
  const deterministicParams = getPopulationParams(params, severity, ageDistribution, true)[0]
  const population = initializePopulation(deterministicParams.populationServed, initialCases, tMin, ageDistribution)
  const deterministicTrajectory = simulate(population, deterministicParams, tMax, ageGroups, identity)

  const thresholds = [0.2, 0.8]
  const idxs = thresholds.map((d) => Math.ceil((stochasticTrajectories.length - 1) * d))
  const R0Trajectories = stochastic
    ? deterministicTrajectory.map((d) => {
        return {
          t: d.time,
          y: stochasticParams
            .map((ModelParams) => ModelParams.rate.infection(d.time) * params.infectiousPeriodDays)
            .sort((a, b) => a - b),
        }
      })
    : []

  const meanR0Trajectory = deterministicTrajectory.map((d) => {
    return {
      t: d.time,
      y: deterministicParams.rate.infection(d.time) * params.infectiousPeriodDays,
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
      lower: stochastic ? R0Trajectories.map((d) => ({ t: d.t, y: d.y[idxs[0]] })) : meanR0Trajectory,
      upper: stochastic ? R0Trajectories.map((d) => ({ t: d.t, y: d.y[idxs[1]] })) : meanR0Trajectory,
    },
    plotData: preparePlotData(resultsTrajectory),
  }
}
