import { Action } from 'redux'
import { isType } from 'typescript-fsa'

import { setCurrentUserUid } from './user.actions'

export interface UserState {
  currentUserUid: string | null
}

export const UserDefaultState: UserState = {
  currentUserUid: null
}

export function userReducer(state = UserDefaultState, action: Action) {
  if(isType(action, setCurrentUserUid)) {
    return { ...state, currentUserUid: action.payload.currentUserUid }
  }

  return state
}