import type { ScenarioParameters } from '../../algorithms/types/Param.types'

import { scenarioNames, getScenarioData } from './getScenarioData'
import { getAgeDistributionData } from './getAgeDistributionData'
import { getSeverityDistributionData } from './getSeverityDistributionData'

export interface ScenarioState extends ScenarioParameters {
  defaultScenariosNames: string[]
  shouldRenameOnEdits: boolean
}

export const DEFAULT_SCENARIO_NAME = 'United States of America'
export const DEFAULT_SEVERITY_DISTRIBUTION = 'China CDC'
export const CUSTOM_COUNTRY_NAME = 'Custom'
export const NONE_COUNTRY_NAME = 'None'

const defaultScenarioData = getScenarioData(DEFAULT_SCENARIO_NAME)
const defaultAgeDistribution = getAgeDistributionData(defaultScenarioData.data.population.ageDistributionName)
const defaultSeverityDistribution = getSeverityDistributionData(DEFAULT_SEVERITY_DISTRIBUTION)

export const defaultScenarioState: ScenarioState = {
  defaultScenariosNames: scenarioNames,
  scenarioData: defaultScenarioData,
  ageDistributionData: defaultAgeDistribution,
  severityDistributionData: defaultSeverityDistribution,
  shouldRenameOnEdits: true,
}
