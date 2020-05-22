import { reducerWithInitialState } from 'typescript-fsa-reducers'

import immerCase from '../util/fsaImmerReducer'

import { toggleAutorun, toggleLogScale, toggleFormatNumbers, toggleResultsMaximized } from './settings.actions'

import { settingsDefaultState } from './settings.state'

export const settingsReducer = reducerWithInitialState(settingsDefaultState)
  .withHandling(
    immerCase(toggleAutorun, (draft) => {
      draft.isAutorunEnabled = !draft.isAutorunEnabled
    }),
  )

  .withHandling(
    immerCase(toggleLogScale, (draft) => {
      draft.isLogScale = !draft.isLogScale
    }),
  )

  .withHandling(
    immerCase(toggleFormatNumbers, (draft) => {
      draft.shouldFormatNumbers = !draft.shouldFormatNumbers
    }),
  )

  .withHandling(
    immerCase(toggleResultsMaximized, (draft) => {
      draft.areResultsMaximized = !draft.areResultsMaximized
    }),
  )
