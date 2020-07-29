import { Saga } from 'redux-saga'
import { all, call, put } from 'redux-saga/effects'

import { errorAdd } from './error/error.actions'

import algorithmSagas from './algorithm/algorithm.sagas'
import scenarioSagas from './scenario/scenario.sagas'
import settingsSagas from './settings/settings.sagas'
import uiSagas from './ui/ui.sagas'

export function autoRestart(generator: Saga, handleError: Saga<[Error]>) {
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

export function* rootSaga() {
  yield all([...algorithmSagas, ...scenarioSagas, ...settingsSagas, ...uiSagas])
}

export function* rootSagaErrorHandler(error: Error) {
  console.error(error.message)
  console.error(error.stack)
  yield put(errorAdd({ error }))
}

export function createRootSaga() {
  return autoRestart(rootSaga, rootSagaErrorHandler)
}
