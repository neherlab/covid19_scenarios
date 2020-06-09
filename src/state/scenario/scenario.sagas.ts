import { put, takeEvery, takeLatest, select } from 'redux-saga/effects'

import { LOCATION_CHANGE, LocationChangeAction } from 'connected-react-router'
import { fromUrl } from '../../io/serialization/fromUrl'
import { algorithmRunTrigger } from '../algorithm/algorithm.actions'
import {
  setAgeDistributionData,
  setScenario,
  setScenarioData,
  setScenarioState,
  setSeverityDistributionData,
} from './scenario.actions'
import { selectIsAutorunEnabled } from '../settings/settings.selectors'

export function* processUrl({ payload: { location } }: LocationChangeAction) {
  const { pathname, search } = location

  if (pathname === '/' && search) {
    const state = fromUrl(search)
    yield put(setScenarioState(state))
  }
}

export function* triggerAlgorithm() {
  const isAutorunEnabled: boolean = yield select(selectIsAutorunEnabled)
  if (isAutorunEnabled) {
    yield put(algorithmRunTrigger())
  }
}

export default [
  takeEvery(LOCATION_CHANGE, processUrl),
  takeLatest(setScenario, triggerAlgorithm),
  takeLatest(setScenarioData, triggerAlgorithm),
  takeLatest(setScenarioState, triggerAlgorithm),
  takeLatest(setSeverityDistributionData, triggerAlgorithm),
  takeLatest(setAgeDistributionData, triggerAlgorithm),
]
