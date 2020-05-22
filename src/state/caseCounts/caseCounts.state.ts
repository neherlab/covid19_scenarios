import type { CaseCountsData } from '../../algorithms/types/Param.types'

import { getCaseCountsData } from '../../io/defaults/getCaseCountsData'

import { defaultScenarioState } from '../scenario/scenario.state'

export interface CaseCountsState {
  caseCountsData?: CaseCountsData
}

const defaultCaseCountsName = defaultScenarioState.scenarioData.data.population.caseCountsName
const defaultCaseCounts = getCaseCountsData(defaultCaseCountsName)

export const defaultCaseCountsState: CaseCountsState = {
  caseCountsData: defaultCaseCounts,
}
