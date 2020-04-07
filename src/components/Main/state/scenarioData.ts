import { AllParams, Convert } from '../../../.generated/types'
import ScenariosValidate, { errors } from '../../../.generated/ScenariosValidate'
import scenariosRaw from '../../../assets/data/scenarios/scenarios.json'

function validate() {
  const valid = ScenariosValidate(scenariosRaw)
  if (!valid) {
    console.error(errors)
    throw new Error('scenario validation error (see errors above)')
  }
}

validate()
const scenarios = Convert.toScenario(JSON.stringify(scenariosRaw))
export const scenarioNames = scenarios.map((scenario) => scenario.country)

export function getScenarioData(key: string): AllParams {
  const scenario = scenarios.find((s) => s.country === key)
  if (!scenario) {
    throw new Error(`Error: scenario "${key}" not found in JSON`)
  }
  return scenario.allParams
}
