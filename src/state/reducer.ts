import { connectRouter, RouterState } from 'connected-react-router'
import { History } from 'history'
import { combineReducers } from 'redux'
import { scenarioReducer, ScenarioState } from './scenario/scenario.reducer'
import { errorReducer, ErrorState } from './error/error.reducer'

export interface State {
  error: ErrorState
  scenario: ScenarioState
  router: RouterState
}

const rootReducer = (history: History) =>
  combineReducers({
    error: errorReducer,
    scenario: scenarioReducer,
    router: connectRouter(history),
  })

export default rootReducer
