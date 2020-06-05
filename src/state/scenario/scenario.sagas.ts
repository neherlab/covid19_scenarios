import { put, takeEvery, takeLatest } from 'redux-saga/effects'

import { LOCATION_CHANGE, LocationChangeAction } from 'connected-react-router'
import { fromUrl } from '../../io/serialization/fromUrl'
import { algorithmRunTrigger } from '../algorithm/algorithm.actions'
import { setScenario, setScenarioData, setScenarioState } from './scenario.actions'

export function* processUrl({ payload: { location } }: LocationChangeAction) {
  const { pathname, search } = location

  if (pathname === '/' && search) {
    const state = fromUrl(search)
    yield put(setScenarioState(state))
  }
}

export function* triggerAlgorithm() {
  yield put(algorithmRunTrigger())
}

export default [
  takeEvery(LOCATION_CHANGE, processUrl),
  takeLatest(setScenario, triggerAlgorithm),
  takeLatest(setScenarioData, triggerAlgorithm),
  takeLatest(setScenarioState, triggerAlgorithm),
]
