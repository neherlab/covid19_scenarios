import { AllParams, Scenario, Convert } from '../../../.generated/types'
import ScenariosValidate, { errors } from '../../../.generated/ScenariosValidate'
import scenariosRaw from '../../../assets/data/scenarios/scenarios.json'

function validate(): Scenario[] {
  const valid = ScenariosValidate(scenariosRaw)
  if (!valid) {
    console.error(errors)
    throw new Error('scenario validation error (see errors above)')
  }

  // FIXME: we cannot afford to Convert.toScenario(), too slow
  return (scenariosRaw as unknown) as Scenario[]
}

const scenarios = validate()
export const scenarioNames = scenarios.map((scenario) => scenario.country)

export function getScenarioData(key: string): AllParams {
  const scenarioFound = scenarios.find((s) => s.country === key)
  if (!scenarioFound) {
    throw new Error(`Error: scenario "${key}" not found in JSON`)
  }

  // FIXME: this should be changed, too hacky
  const [scenario] = Convert.toScenario(JSON.stringify([scenarioFound]))
  return scenario.allParams
}
