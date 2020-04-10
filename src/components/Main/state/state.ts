import i18next from 'i18next'
import { scenarioNames, getScenarioData } from './scenarioData'
import { getCountryAgeDistribution } from './countryAgeDistributionData'
import { ScenarioData, AgeDistribution } from '../../../algorithms/types/Param.types'

export interface State {
  scenarios: string[]
  current: string
  data: ScenarioData
  ageDistribution: AgeDistribution
}

// TODO: Add a default category to export
export const DEFAULT_OVERALL_SCENARIO_NAME = 'United States of America'
export const CUSTOM_SCENARIO_NAME = i18next.t('Custom')
export const CUSTOM_COUNTRY_NAME = 'Custom'

export const defaultScenarioName = DEFAULT_OVERALL_SCENARIO_NAME

const defaultScenarioData = getScenarioData(defaultScenarioName)

export const defaultScenarioState: State = {
  scenarios: scenarioNames,
  current: defaultScenarioName,
  data: defaultScenarioData,
  ageDistribution: getCountryAgeDistribution(defaultScenarioData.population.country),
}
