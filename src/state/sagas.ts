import { Saga } from 'redux-saga'
import { all, call, put } from 'redux-saga/effects'

import { errorAdd } from './error/error.actions'

import algorithmSagas from './algorithm/algorithm.sagas'

const allSagas = [...algorithmSagas]

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
  yield all(allSagas)
}

function* rootErrorHandler(error: Error) {
  console.error(error.message)
  yield put(errorAdd({ error }))
}

export default function createRootSaga() {
  return autoRestart(rootSaga, rootErrorHandler)
}
