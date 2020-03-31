import _ from 'lodash'

import scenarios from '../../../assets/data/scenarios/scenarios.json'

import { ScenarioData } from '../../../algorithms/types/Param.types'

export type Scenario = string

export const scenarioNames = Object.keys(scenarios)

export function getScenarioData(key: string): ScenarioData {
  // TODO: use schema-generate type, validate against schema on runtime
  const scenarioData = _.get(scenarios, key) as ScenarioData | null
  if (!scenarioData) {
    throw new Error(`Error: scenario "${key}" not found in JSON`)
  }
  return { ...scenarioData, containment: { mitigationIntervals: [] } }
}
