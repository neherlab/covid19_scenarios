import { Action } from 'redux'
import { isType } from 'typescript-fsa'

import LocalStorage, { LOCAL_STORAGE_KEYS } from '../../helpers/localStorage'
import { setShouldSkipLandingPage, setLoginVisible, setSignupVisible } from './ui.actions'

export interface UiState {
  skipLandingPage: boolean
  loginFormVisible: boolean
  signupFormVisible: boolean
}

export const uiDefaultState: UiState = {
  skipLandingPage: Boolean(LocalStorage.get(LOCAL_STORAGE_KEYS.SKIP_LANDING_PAGE)),
  loginFormVisible: false,
  signupFormVisible: false
}

export function uiReducer(state: UiState = uiDefaultState, action: Action) {
  if (isType(action, setShouldSkipLandingPage)) {
    return { ...state, skipLandingPage: action.payload.shouldSkip }
  }
  if (isType(action, setLoginVisible)) {
    return { ...state, loginFormVisible: action.payload.loginVisible }
  }
  if (isType(action, setSignupVisible)) {
    return { ...state, signupFormVisible: action.payload.signupVisible }
  }

  return state
}
