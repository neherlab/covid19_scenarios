import rawScenarios from './scenarios.json'
import { ScenarioData } from '../../../algorithms/types/Param.types'
import { makeTimeSeries } from '../../../algorithms/utils/TimeSeries'

const scenarios: Record<string, ScenarioData> = {}

Object.keys(rawScenarios).forEach(k => {
  const data = rawScenarios[k]
  const tMin = new Date(data.simulation.simulationTimeRange.tMin)
  const tMax = new Date(data.simulation.simulationTimeRange.tMax)

  scenarios[k] = {
    population: {
      ...data.population,
    },
    epidemiological: {
      ...data.epidemiological,
    },
    containment: {
      reduction: makeTimeSeries({ tMin: tMin, tMax: tMax }, data.containment.reduction),
      numberPoints: data.containment.reduction.length,
    },
    simulation: {
      simulationTimeRange: { tMin: tMin, tMax: tMax },
      numberStochasticRuns: 0,
    },
  }
})

export default scenarios
