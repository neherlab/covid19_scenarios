import validateScenarioArray, { errors } from '../../.generated/latest/validateScenarioArray'

import type { ScenarioArray, ScenarioData } from '../../algorithms/types/Param.types'

import { Convert } from '../../algorithms/types/Param.types'
import { toInternal } from '../../algorithms/types/convert'

import scenariosRaw from '../../assets/data/scenarios.json'

function validate(): ScenarioData[] {
  const valid = validateScenarioArray(scenariosRaw)
  if (!valid) {
    throw errors
  }

  // FIXME: we cannot afford to Convert.toScenario(), too slow
  return ((scenariosRaw as unknown) as ScenarioArray).all
}

const scenarios = validate()
export const scenarioNames = scenarios.map((scenario) => scenario.name)

export function getScenarioData(name: string): ScenarioData {
  const scenarioFound = scenarios.find((s) => s.name === name)
  if (!scenarioFound) {
    throw new Error(`Error: scenario "${name}" not found in JSON`)
  }

  // FIXME: this should be changed, too hacky
  const scenarioData = Convert.toScenarioData(JSON.stringify(scenarioFound))
  return { ...scenarioData, data: toInternal(scenarioData.data) }
}
