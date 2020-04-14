import { AgeDistribution } from '../.generated/types'
import { SeverityTableRow } from '../components/Main/Scenario/ScenarioTypes'
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
  severity: SeverityTableRow[],
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
    trajectories.push(simulate(population, identity))
  })

  const mean = meanTrajectory(trajectories)
  const sdev = stddevTrajectory(trajectories, mean)

  const sim: AlgorithmResult = {
    trajectory: {
      mean: mean,
      upper: mean.map((m, i) => mulTP(m, sdev[i])),
      lower: mean.map((m, i) => divTP(m, sdev[i])),
    },
    percentile: {},
  }

  return sim
}
