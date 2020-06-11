import { SagaIterator } from 'redux-saga'
import { takeLatest, select } from 'redux-saga/effects'
import { RunParams } from '../../algorithms/run'

import { selectRunParams } from '../scenario/scenario.selectors'
import fsaSaga from '../util/fsaSaga'

import { algorithmRunAsync, AlgorithmRunResults, algorithmRunTrigger } from './algorithm.actions'

import { run } from '../../workers/algorithm'

export function* workerAlgorithmRun(): SagaIterator | AlgorithmRunResults {
  const params = (yield select(selectRunParams) as unknown) as RunParams
  const result = (yield run(params) as unknown) as AlgorithmRunResults
  return { result }
}

export default [takeLatest(algorithmRunTrigger, fsaSaga(algorithmRunAsync, workerAlgorithmRun))]
