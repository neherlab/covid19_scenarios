import actionCreatorFactory from 'typescript-fsa'

const action = actionCreatorFactory('User')

export interface GenericUserParams {
  currentUserUid?: string | null
  currentUserName?: string | null
  currentUserPhoto?: string | null
}

export const setCurrentUserUid = action<GenericUserParams>('USER_SET_CURRENT_USER_UID')
export const setCurrentUserName = action<GenericUserParams>('USER_SET_CURRENT_USER_NAME')
export const setCurrentUserPhoto = action<GenericUserParams>('USER_SET_CURRENT_USER_PHOTO')
