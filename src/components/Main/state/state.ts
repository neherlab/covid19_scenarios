import i18next from 'i18next'

import { scenarioNames, getScenarioData } from './data'

import { ScenarioData } from '../../../algorithms/types/Param.types'

export interface State {
  scenarios: string[]
  current: string
  data: ScenarioData
}

export interface ManyScenariosState {
  [key: string]: State
}

// TODO: Add a default category to export
export const DEFAULT_SCENARIO_ID = 'customize'
export const DEFAULT_OVERALL_SCENARIO_NAME = i18next.t('CHE-Basel-Stadt')
export const CUSTOM_SCENARIO_NAME = i18next.t('Custom')

export const defaultScenarioName = DEFAULT_OVERALL_SCENARIO_NAME

export const defaultScenarioState: ManyScenariosState = {
  [DEFAULT_SCENARIO_ID]: {
    scenarios: scenarioNames,
    current: defaultScenarioName,
    data: getScenarioData(defaultScenarioName),
  },
}
