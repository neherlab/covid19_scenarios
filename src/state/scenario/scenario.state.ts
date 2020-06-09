import { CaseCountsData } from '../../algorithms/types/Param.types'
import type { ScenarioParameters } from '../../algorithms/types/Param.types'

import { scenarioNames, getScenarioData } from '../../io/defaults/getScenarioData'
import { getAgeDistributionData } from '../../io/defaults/getAgeDistributionData'
import { getSeverityDistributionData } from '../../io/defaults/getSeverityDistributionData'
import { getCaseCountsData } from '../../io/defaults/getCaseCountsData'
import { DEFAULT_SCENARIO_NAME, DEFAULT_SEVERITY_DISTRIBUTION } from '../../constants'

export interface ScenarioState extends ScenarioParameters {
  defaultScenariosNames: string[]
  shouldRenameOnEdits: boolean
  canRun: boolean
  caseCountsData?: CaseCountsData
  caseCountsNameCustom?: string
}

const defaultScenarioData = getScenarioData(DEFAULT_SCENARIO_NAME)
const defaultAgeDistribution = getAgeDistributionData(defaultScenarioData.data.population.ageDistributionName)
const defaultSeverityDistribution = getSeverityDistributionData(DEFAULT_SEVERITY_DISTRIBUTION)
const defaultCaseCounts = getCaseCountsData(defaultScenarioData.data.population.caseCountsName)

export const defaultScenarioState: ScenarioState = {
  defaultScenariosNames: scenarioNames,
  scenarioData: defaultScenarioData,
  ageDistributionData: defaultAgeDistribution,
  severityDistributionData: defaultSeverityDistribution,
  shouldRenameOnEdits: true,
  canRun: true,
  caseCountsData: defaultCaseCounts,
}
