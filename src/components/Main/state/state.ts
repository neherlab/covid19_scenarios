import { scenarioNames, getScenario } from './getScenario'
import { getAgeDistribution } from './getAgeDistribution'
import { ScenarioDatum, AgeDistributionDatum } from '../../../algorithms/types/Param.types'

export interface State {
  scenarios: string[]
  current: string
  shouldRenameOnEdits: boolean
  data: ScenarioDatum
  ageDistribution: AgeDistributionDatum[]
}

// TODO: Add a default category to export
export const DEFAULT_OVERALL_SCENARIO_NAME = 'United States of America'
export const CUSTOM_COUNTRY_NAME = 'Custom'
export const NONE_COUNTRY_NAME = 'None'

export const defaultScenarioName = DEFAULT_OVERALL_SCENARIO_NAME

const defaultScenarioData = getScenario(defaultScenarioName)

export const defaultScenarioState: State = {
  scenarios: scenarioNames,
  current: defaultScenarioName,
  shouldRenameOnEdits: true,
  data: defaultScenarioData,
  ageDistribution: getAgeDistribution(defaultScenarioData.population.ageDistributionName),
}
