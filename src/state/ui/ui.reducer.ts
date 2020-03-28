import { Action } from 'redux'
import { isType } from 'typescript-fsa'

import { setShouldSkipLandingPage } from './ui.actions'

export const SKIP_LANDING_PAGE_KEY = 'skip-landing-page'

export interface UiState {
  skipLandingPage: boolean
}

export const uiDefaultState: UiState = {
  skipLandingPage: !!localStorage.getItem(SKIP_LANDING_PAGE_KEY),
}

export function uiReducer(state: UiState = uiDefaultState, action: Action) {
  if (isType(action, setShouldSkipLandingPage)) {
    return { ...state, skipLandingPage: action.payload.shouldSkip }
  }

  return state
}
