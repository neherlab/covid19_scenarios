import { takeLatest, select, put } from 'redux-saga/effects'

import { selectRunParams } from '../scenario/scenario.selectors'
import fsaSaga from '../util/fsaSaga'

import { algorithmRunAsync, AlgorithmRunResults, algorithmRunTrigger, setResults } from './algorithm.actions'

import { run } from '../../workers/algorithm'

export function* workerAlgorithmRun() {
  const params = yield select(selectRunParams)
  return run(params)
}

export interface SagaSetResultsParams {
  payload: {
    result: AlgorithmRunResults
  }
}

export function* sagaSetResults({ payload: { result } }: SagaSetResultsParams) {
  yield put(setResults({ result: result.result }))
}

export default [
  takeLatest(algorithmRunTrigger, fsaSaga(algorithmRunAsync, workerAlgorithmRun)),
  takeLatest(algorithmRunAsync.done, sagaSetResults),
]
