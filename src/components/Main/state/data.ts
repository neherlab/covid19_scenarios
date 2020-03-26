export type Scenario = string

import scenarios from '../../../assets/data/scenarios/scenarios.json'
import { ScenarioData } from '../../../algorithms/types/Param.types'

export const scenarioNames = Object.keys(scenarios)

export function getScenarioData(key: string): ScenarioData {
  if (!(key in scenarios)) {
    throw new Error(`Error: scenario "${scenario}" not found in JSON`)
  }
  const data = scenarios[key]
  return data
}
