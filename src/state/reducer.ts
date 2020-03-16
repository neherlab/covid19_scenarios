import { connectRouter, RouterState } from 'connected-react-router'
import { History } from 'history'
import { combineReducers } from 'redux'

import { errorReducer, ErrorState } from './error/error.reducer'

import { AlgorithmState } from './algorithm/algorithm.state'
import { algorithmReducer } from './algorithm/algorithm.reducer'
import { ScenarioState } from './scenario/scenario.state'
import { scenarioReducer } from './scenario/scenario.reducer'

const rootReducer = (history: History) =>
  combineReducers({
    algorithm: algorithmReducer,
    error: errorReducer,
    scenario: scenarioReducer,
    router: connectRouter(history),
  })

export interface State {
  algorithm: AlgorithmState
  error: ErrorState
  scenario: ScenarioState
  router: RouterState
}

export default rootReducer
