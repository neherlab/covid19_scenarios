import { Action } from 'redux'
import { isType } from 'typescript-fsa'

import { setLoginVisible, setSignupVisible } from './ui.actions'

export interface UiState {
  loginFormVisible: boolean
  signupFormVisible: boolean
}

export const uiDefaultState: UiState = {
  loginFormVisible: false,
  signupFormVisible: false,
}

export function uiReducer(state: UiState = uiDefaultState, action: Action) {
  if (isType(action, setLoginVisible)) {
    return { ...state, loginFormVisible: action.payload.loginVisible }
  }
  if (isType(action, setSignupVisible)) {
    return { ...state, signupFormVisible: action.payload.signupVisible }
  }

  return state
}
