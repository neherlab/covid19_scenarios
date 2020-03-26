import actionCreatorFactory from 'typescript-fsa'

const action = actionCreatorFactory('UI')

export interface GenericUiParams {
  shouldSkip: boolean
}

export const setShouldSkipLandingPage = action<GenericUiParams>('UI_SET_SHOULD_SKIP_LANDING_PAGE')
