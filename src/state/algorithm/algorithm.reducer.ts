import { reducerWithInitialState } from 'typescript-fsa-reducers'

import immerCase from '../util/fsaImmerReducer'
import { algorithmRunAsync } from './algorithm.actions'
import { defaultAlgorithmState } from './algorithm.state'

export const algorithmReducer = reducerWithInitialState(defaultAlgorithmState) // prettier-ignore
  .withHandling(
    immerCase(algorithmRunAsync.started, (draft) => {
      draft.isRunning = true
    }),
  )

  .withHandling(
    immerCase(algorithmRunAsync.done, (draft, { result }) => {
      draft.isRunning = false
      draft.result = result.result
    }),
  )

  .withHandling(
    immerCase(algorithmRunAsync.failed, (draft) => {
      draft.isRunning = false
    }),
  )
