import { reducerWithInitialState } from 'typescript-fsa-reducers'

import immerCase from '../util/fsaImmerReducer'

import { runAlgorithmAsync, setCanRun } from './algorithm.actions'
import { defaultAlgorithmState } from './algorithm.state'

export const algorithmReducer = reducerWithInitialState(defaultAlgorithmState)
  .withHandling(
    immerCase(setCanRun, (draft, { canRun }) => {
      draft.canRun = canRun
    }),
  )

  .withHandling(
    immerCase(runAlgorithmAsync.started, draft => {
      draft.running += 1
    }),
  )

  .withHandling(
    immerCase(runAlgorithmAsync.done, (draft, { params, result }) => {
      draft.result = result
      draft.running -= 1
    }),
  )

  .withHandling(
    immerCase(runAlgorithmAsync.failed, (draft, { params, error }) => {
      draft.error = error
      draft.running -= 1
    }),
  )
