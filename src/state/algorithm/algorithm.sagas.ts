import { SagaIterator } from 'redux-saga'
import { takeLatest, select } from 'redux-saga/effects'

import { selectRunParams } from '../scenario/scenario.selectors'
import fsaSaga from '../util/fsaSaga'

import { algorithmRunAsync, AlgorithmRunResults, algorithmRunTrigger } from './algorithm.actions'

import { run } from '../../workers/algorithm'

export function* workerAlgorithmRun(): SagaIterator | AlgorithmRunResults {
  const params = yield select(selectRunParams)
  const result = yield run(params)
  return { result }
}

export default [takeLatest(algorithmRunTrigger, fsaSaga(algorithmRunAsync, workerAlgorithmRun))]
