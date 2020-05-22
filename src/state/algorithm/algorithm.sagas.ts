import { takeLatest, select } from 'redux-saga/effects'

import { selectRunParams } from '../scenario/scenario.selectors'
import fsaSaga from '../util/fsaSaga'

import { algorithmRunAsync, algorithmRunTrigger } from './algorithm.actions'

import { run } from '../../workers/algorithm'

export function* workerAlgorithmRun() {
  const params = yield select(selectRunParams)
  return run(params)
}

export default [takeLatest(algorithmRunTrigger, fsaSaga(algorithmRunAsync, workerAlgorithmRun))]
