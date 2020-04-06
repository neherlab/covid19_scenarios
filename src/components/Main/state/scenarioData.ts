import _ from 'lodash'
import Ajv from 'ajv'

import { Scenario, AllParams, Convert } from '../../../.generated/types/types'

import scenariosRaw from '../../../assets/data/scenarios/scenarios.json'
import schema from '../../../../schemas/Scenarios.yml'

function validate() {
  const ajv = new Ajv()
  const valid = ajv.validate(schema, scenariosRaw)
  if (!valid) {
    console.error(ajv.errors)
    throw new Error('scenario validation error')
  }
  return (scenariosRaw as unknown) as Scenario[]
}

const scenariosRawValidated = validate()

export const scenarioNames = scenariosRawValidated.map((scenario) => scenario.country)

export function getScenarioData(key: string): AllParams {
  const scenarioRaw = scenariosRawValidated.find((scenario) => scenario.country === key)
  if (!scenarioRaw) {
    throw new Error(`Error: scenario "${key}" not found in JSON`)
  }
  const scenario = Convert.toScenario(JSON.stringify(scenarioRaw))
  return scenario.allParams
}
