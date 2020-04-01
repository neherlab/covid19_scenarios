import actionCreatorFactory from 'typescript-fsa'

const action = actionCreatorFactory('UI')

export interface GenericUiParams {
  shouldSkip?: boolean
  loginVisible?: boolean
  signupVisible?: boolean
}

export const setShouldSkipLandingPage = action<GenericUiParams>('UI_SET_SHOULD_SKIP_LANDING_PAGE')
export const setLoginVisible = action<GenericUiParams>('UI_SET_LOGIN_VISIBLE')
export const setSignupVisible = action<GenericUiParams>('UI_SET_SIGNUP_VISIBLE')
