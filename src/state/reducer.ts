import { connectRouter, RouterState } from 'connected-react-router'
import { History } from 'history'
import { combineReducers } from 'redux'

import { errorReducer, ErrorState } from './error/error.reducer'
import { uiReducer, UiState } from './ui/ui.reducer'
import { userReducer, UserState } from './user/user.reducer'

const rootReducer = (history: History) =>
  combineReducers({
    ui: uiReducer,
    user: userReducer,
    error: errorReducer,
    router: connectRouter(history),
  })

export interface State {
  ui: UiState
  user: UserState
  error: ErrorState
  router: RouterState
}

export default rootReducer
