import scenarios from '../../../assets/data/scenarios/scenarios'
import { ScenarioData } from '../../../algorithms/types/Param.types'

export type Scenario = string

export const scenarioNames = Object.keys(scenarios)

export function getScenarioData(key: string): ScenarioData {
  if (!(key in scenarios)) {
    throw new Error(`Error: scenario "${key}" not found in JSON`)
  }
  const tmp = scenarios[key]
  tmp.epidemiological.r0 = [2, 4]
  return tmp
}
