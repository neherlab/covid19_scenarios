import { put, takeLatest, select } from 'typed-redux-saga'

import type { LocationState } from 'connected-next-router/types'
import type { LocationChangeAction } from 'connected-next-router/actions'
import { routerActions, LOCATION_CHANGE } from 'connected-next-router'

import { init } from 'src/state/app/init.actions'
import { fromUrl } from 'src/io/serialization/fromUrl'
import { algorithmRunTrigger } from 'src/state/algorithm/algorithm.actions'
import {
  addMitigationInterval,
  removeMitigationInterval,
  setAgeDistributionData,
  setScenario,
  setScenarioData,
  setScenarioState,
  setSeverityDistributionData,
} from 'src/state/scenario/scenario.actions'
import { selectIsAutorunEnabled } from 'src/state/settings/settings.selectors'
import { selectLocation } from 'src/state/router/router.selectors'

export function* onInit() {
  const location = yield* select(selectLocation)
  yield* processUrl(location)
}

export function* onLocationChange({ payload: { location } }: LocationChangeAction) {
  yield* processUrl(location)
}

export function* processUrl(location: LocationState) {
  const { pathname, search } = location
  if (pathname === '/' && search && search !== '') {
    const state = fromUrl(search)
    yield* put(routerActions.replace({ pathname, search: '' }))
    yield* put(setScenarioState(state))
  } else {
    yield* triggerAlgorithm()
  }
}

export function* triggerAlgorithm() {
  const isAutorunEnabled = yield* select(selectIsAutorunEnabled)
  if (isAutorunEnabled) {
    yield* put(algorithmRunTrigger())
  }
}

export default [
  takeLatest(init, onInit),
  takeLatest(LOCATION_CHANGE, onLocationChange),
  takeLatest(setScenario, triggerAlgorithm),
  takeLatest(setScenarioData, triggerAlgorithm),
  takeLatest(setScenarioState, triggerAlgorithm),
  takeLatest(setSeverityDistributionData, triggerAlgorithm),
  takeLatest(setAgeDistributionData, triggerAlgorithm),
  takeLatest(addMitigationInterval, triggerAlgorithm),
  takeLatest(removeMitigationInterval, triggerAlgorithm),
]
