import { put, takeEvery } from 'redux-saga/effects'

import { LOCATION_CHANGE, LocationChangeAction } from 'connected-react-router'
import { fromUrl } from '../../io/serialization/fromUrl'
import { setScenarioState } from './scenario.actions'

export function* processUrl({ payload: { location } }: LocationChangeAction) {
  const { pathname, search } = location

  if (pathname === '/' && search) {
    const state = fromUrl(search)
    yield put(setScenarioState(state))
  }
}

export default [takeEvery(LOCATION_CHANGE, processUrl)]
