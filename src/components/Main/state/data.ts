export type Scenario = string

import scenarios from '../../../assets/data/scenarios/scenarios'
import { ScenarioData } from '../../../algorithms/types/Param.types'

export const scenarioNames = Object.keys(scenarios)

export function getScenarioData(key: string): ScenarioData {
  if (!(key in scenarios)) {
    throw new Error(`Error: scenario "${key}" not found in JSON`)
  }
  return scenarios[key]
}
