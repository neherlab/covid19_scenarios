import actionCreatorFactory from 'typescript-fsa'

const action = actionCreatorFactory('User')

export interface GenericUserParams {
  currentUserUid: string
}

export const setCurrentUserUid = action<GenericUserParams>('USER_SET_CURRENT_USER_UID')