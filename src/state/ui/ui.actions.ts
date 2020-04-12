import actionCreatorFactory from 'typescript-fsa'

const action = actionCreatorFactory('UI')

export interface GenericUiParams {
  loginVisible?: boolean
  signupVisible?: boolean
}

export const setLoginVisible = action<GenericUiParams>('UI_SET_LOGIN_VISIBLE')
export const setSignupVisible = action<GenericUiParams>('UI_SET_SIGNUP_VISIBLE')
