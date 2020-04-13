import { Action } from 'redux'
import { isType } from 'typescript-fsa'

import { setCurrentUserUid, setCurrentUserName, setCurrentUserPhoto } from './user.actions'

export interface UserState {
  currentUserUid: string | null
  currentUserName: string | null
  currentUserPhoto: string | null
}

export const UserDefaultState: UserState = {
  currentUserUid: null,
  currentUserName: null,
  currentUserPhoto: null,
}

export function userReducer(state = UserDefaultState, action: Action) {
  if (isType(action, setCurrentUserUid)) {
    return { ...state, currentUserUid: action.payload.currentUserUid }
  }
  if (isType(action, setCurrentUserName)) {
    return { ...state, currentUserName: action.payload.currentUserName }
  }
  if (isType(action, setCurrentUserPhoto)) {
    return { ...state, currentUserPhoto: action.payload.currentUserPhoto }
  }

  return state
}
