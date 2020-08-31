import { reducerWithInitialState } from 'src/state/util/fsaReducer'

import { errorAdd, errorDismiss } from './error.actions'

export interface ErrorState {
  error: string | null
}

export const errorDefaultState: ErrorState = {
  error: null,
}

export const errorReducer = reducerWithInitialState(errorDefaultState)
  .icase(errorAdd, (state, { error }) => {
    state.error = error.message
  })

  .icase(errorDismiss, (state) => {
    state.error = null
  })
