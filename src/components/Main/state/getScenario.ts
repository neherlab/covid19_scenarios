import { ScenarioArray, ScenarioData, ScenarioDatum, Convert } from '../../../.generated/types'
import validateScenarioArray, { errors } from '../../../.generated/validateScenarioArray'
import scenariosRaw from '../../../assets/data/scenarios.json'

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

export function getScenario(name: string): ScenarioDatum {
  const scenarioFound = scenarios.find((s) => s.name === name)
  if (!scenarioFound) {
    throw new Error(`Error: scenario "${name}" not found in JSON`)
  }

  // FIXME: this should be changed, too hacky
  const scenario = Convert.toScenarioData(JSON.stringify(scenarioFound))
  return scenario.data
}
