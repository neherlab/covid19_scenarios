import actionCreatorFactory from 'typescript-fsa'

const action = actionCreatorFactory('ERROR')

export interface GenericErrorParams {
  error: Error
}

export const errorAdd = action<GenericErrorParams>('ERROR_ADD')

export const errorDismiss = action<{}>('ERROR_DISMISS')
