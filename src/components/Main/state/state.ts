import i18next from 'i18next'
import { scenarioNames, getScenarioData, getAgeDistribution } from './data'
import { ScenarioData } from '../../../algorithms/types/Param.types'
import { OneCountryAgeDistribution } from '../../../assets/data/CountryAgeDistribution.types'

export interface State {
  scenarios: string[]
  current: string
  data: ScenarioData
  ageDistribution: OneCountryAgeDistribution
}

// TODO: Add a default category to export
export const DEFAULT_OVERALL_SCENARIO_NAME = 'CHE-Basel-Stadt'
export const CUSTOM_SCENARIO_NAME = i18next.t('Custom')

export const defaultScenarioName = DEFAULT_OVERALL_SCENARIO_NAME

const defaultScenarioData = getScenarioData(defaultScenarioName)

export const defaultScenarioState: State = {
  scenarios: scenarioNames,
  current: defaultScenarioName,
  data: defaultScenarioData,
  ageDistribution: getAgeDistribution(defaultScenarioData.population.country),
}
