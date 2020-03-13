import { Action } from 'redux'
import { isType } from 'typescript-fsa'

import { errorAdd, errorDismiss } from './error.actions'

export interface ErrorState {
  error: string | null
}

export const errorDefaultState: ErrorState = {
  error: null,
}

export function errorReducer(state: ErrorState = errorDefaultState, action: Action) {
  if (isType(action, errorAdd)) {
    return { ...state, error: action.payload.error.message }
  }

  if (isType(action, errorDismiss)) {
    return { ...state, error: null }
  }

  return state
}
