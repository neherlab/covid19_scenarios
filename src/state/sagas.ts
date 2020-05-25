import { Saga } from 'redux-saga'
import { all, call, put } from 'redux-saga/effects'

import { errorAdd } from './error/error.actions'

import algorithmSagas from './algorithm/algorithm.sagas'
import scenarioSagas from './scenario/scenario.sagas'
import uiSagas from './ui/ui.sagas'

function autoRestart(generator: Saga, handleError: Saga<[Error]>) {
  return function* autoRestarting() {
    while (true) {
      try {
        yield call(generator)
        break
      } catch (error) {
        yield handleError(error)
      }
    }
  }
}

function* rootSaga() {
  yield all([...algorithmSagas, ...scenarioSagas, ...uiSagas])
}

function* rootErrorHandler(error: Error) {
  console.error(error.message)
  yield put(errorAdd({ error }))
}

export default function createRootSaga() {
  return autoRestart(rootSaga, rootErrorHandler)
}
