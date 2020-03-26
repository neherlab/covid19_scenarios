export type Scenario = string

import scenarios from '../../../assets/data/scenarios/scenarios.json'
import { ScenarioData } from '../../../algorithms/types/Param.types'
import { makeTimeSeries } from '../../../algorithms/utils/TimeSeries'

export const scenarioNames = Object.keys(scenarios)

export function getScenarioData(key: string): ScenarioData {
  if (!(key in scenarios)) {
    throw new Error(`Error: scenario "${key}" not found in JSON`)
  }
  // TODO: scenarios output should be typed
  //       this is a hacky workaround for now
  const data: ScenarioData = scenarios[key]

  data.simulation.simulationTimeRange.tMin = new Date(data.simulation.simulationTimeRange.tMin)
  data.simulation.simulationTimeRange.tMax = new Date(data.simulation.simulationTimeRange.tMax)
  data.containment.reduction = makeTimeSeries(data.simulation.simulationTimeRange, data.containment.reduction)

  return data
}
