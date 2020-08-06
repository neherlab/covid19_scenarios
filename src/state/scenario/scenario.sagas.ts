import { put, takeLatest, select } from 'redux-saga/effects'

import type { LocationChangeAction } from 'connected-next-router/actions'
import { replace, LOCATION_CHANGE } from 'connected-next-router'
import { fromUrl } from '../../io/serialization/fromUrl'
import { algorithmRunTrigger } from '../algorithm/algorithm.actions'
import {
  addMitigationInterval,
  removeMitigationInterval,
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
    yield put(replace({ pathname, search: '' }))
    yield put(setScenarioState(state))
    yield put(algorithmRunTrigger())
  } else {
    yield put(algorithmRunTrigger())
  }
}

export function* triggerAlgorithm() {
  const isAutorunEnabled = (yield select(selectIsAutorunEnabled) as unknown) as boolean
  if (isAutorunEnabled) {
    yield put(algorithmRunTrigger())
  }
}

export default [
  takeLatest(LOCATION_CHANGE, processUrl),
  takeLatest(setScenario, triggerAlgorithm),
  takeLatest(setScenarioData, triggerAlgorithm),
  takeLatest(setScenarioState, triggerAlgorithm),
  takeLatest(setSeverityDistributionData, triggerAlgorithm),
  takeLatest(setAgeDistributionData, triggerAlgorithm),
  takeLatest(addMitigationInterval, triggerAlgorithm),
  takeLatest(removeMitigationInterval, triggerAlgorithm),
]
