import { connectRouter, RouterState } from 'connected-react-router'
import { History } from 'history'
import { combineReducers } from 'redux'

import { errorReducer, ErrorState } from './error/error.reducer'
import { uiReducer, UiState } from './ui/ui.reducer'
import { settingsReducer, SettingsState } from './settings/settings.reducer'

const rootReducer = (history: History) =>
  combineReducers({
    ui: uiReducer,
    error: errorReducer,
    settings: settingsReducer,
    router: connectRouter(history),
  })

export interface State {
  ui: UiState
  error: ErrorState
  settings: SettingsState
  router: RouterState
}

export default rootReducer
