import { connectRouter, RouterState } from 'connected-react-router'
import { History } from 'history'
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { algorithmReducer } from './algorithm/algorithm.reducer'
import { AlgorithmState } from './algorithm/algorithm.state'

import type { ScenarioState } from './scenario/scenario.state'
import { scenarioReducer } from './scenario/scenario.reducer'

import { errorReducer, ErrorState } from './error/error.reducer'

import type { SettingsState } from './settings/settings.state'
import { settingsReducer } from './settings/settings.reducer'

import type { CaseCountsState } from './caseCounts/caseCounts.state'
import { caseCountsReducer } from './caseCounts/caseCounts.reducer'

const SETTINGS_VERSION = 1
const settingsReducerPersisted = persistReducer(
  { key: 'settings', version: SETTINGS_VERSION, storage, timeout: 3000 },
  settingsReducer,
)

export interface State {
  algorithm: AlgorithmState
  error: ErrorState
  scenario: ScenarioState
  settings: SettingsState
  caseCounts: CaseCountsState
  router: RouterState
}

const rootReducer = (history: History) =>
  combineReducers({
    algorithm: algorithmReducer,
    error: errorReducer,
    scenario: scenarioReducer,
    settings: settingsReducerPersisted,
    caseCounts: caseCountsReducer,
    router: connectRouter(history),
  })

export default rootReducer
