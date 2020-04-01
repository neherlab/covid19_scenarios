import { Action } from 'redux'
import { isType } from 'typescript-fsa'

import LocalStorage, { LOCAL_STORAGE_KEYS } from '../../helpers/localStorage'
import { setShouldSkipLandingPage } from './ui.actions'

export interface UiState {
  skipLandingPage: boolean
}

console.log(LocalStorage, LocalStorage.get(LOCAL_STORAGE_KEYS.SKIP_LANDING_PAGE) === 'true')

export const uiDefaultState: UiState = {
  skipLandingPage: LocalStorage.get(LOCAL_STORAGE_KEYS.SKIP_LANDING_PAGE) === 'true',
}

export function uiReducer(state: UiState = uiDefaultState, action: Action) {
  if (isType(action, setShouldSkipLandingPage)) {
    return { ...state, skipLandingPage: action.payload.shouldSkip }
  }

  return state
}
