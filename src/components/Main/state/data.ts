import _ from 'lodash'

import scenarios from '../../../assets/data/scenarios/scenarios.json'

import { MitigationIntervals, ScenarioData } from '../../../algorithms/types/Param.types'

export type Scenario = string

export const scenarioNames = Object.keys(scenarios)

export function getScenarioData(key: string): ScenarioData {
  // TODO: use schema: generate type, validate against schema on runtime
  const scenarioData = _.get(scenarios, key) as ScenarioData | null

  if (!scenarioData) {
    throw new Error(`Error: scenario "${key}" not found in JSON`)
  }

  // Convert dates
  // TODO: implement proper compile-time + runtime validation and deserialization
  const mitigationIntervals: MitigationIntervals = scenarioData.containment.mitigationIntervals.map((interval) => {
    let { tMin, tMax } = interval.timeRange
    tMin = new Date(tMin)
    tMax = new Date(tMax)

    return {
      ...interval,
      timeRange: { tMin, tMax },
    }
  })

  return { ...scenarioData, containment: { mitigationIntervals } }
}
