import { connectRouter, RouterState } from 'connected-react-router'
import { History } from 'history'
import { combineReducers } from 'redux'

import { errorReducer, ErrorState } from './error/error.reducer'

const rootReducer = (history: History) =>
  combineReducers({
    error: errorReducer,
    router: connectRouter(history),
  })

export interface State {
  error: ErrorState
  router: RouterState
}

export default rootReducer
