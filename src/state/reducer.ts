import { connectRouter, RouterState } from 'connected-react-router'
import { History } from 'history'
import { combineReducers } from 'redux'

import type { ScenarioState } from './scenario/scenario.state'
import { scenarioReducer } from './scenario/scenario.reducer'

import { errorReducer, ErrorState } from './error/error.reducer'

import type { SettingsState } from './settings/settings.state'
import { settingsReducer } from './settings/settings.reducer'

import type { CaseCountsState } from './caseCounts/caseCounts.state'
import { caseCountsReducer } from './caseCounts/caseCounts.reducer'

export interface State {
  error: ErrorState
  scenario: ScenarioState
  settings: SettingsState
  caseCounts: CaseCountsState
  router: RouterState
}

const rootReducer = (history: History) =>
  combineReducers({
    error: errorReducer,
    scenario: scenarioReducer,
    settings: settingsReducer,
    caseCounts: caseCountsReducer,
    router: connectRouter(history),
  })

export default rootReducer
