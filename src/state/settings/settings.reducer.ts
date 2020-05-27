import { reducerWithInitialState } from 'typescript-fsa-reducers'

import immerCase from '../util/fsaImmerReducer'

import {
  setAutorun,
  setLogScale,
  setFormatNumbers,
  setResultsMaximized,
  toggleAutorun,
  toggleLogScale,
  toggleFormatNumbers,
  toggleResultsMaximized,
  setDisclaimerVersionAccepted,
  toggleDisclaimerShouldSuppress,
} from './settings.actions'

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

  .withHandling(
    immerCase(setAutorun, (draft, isAutorunEnabled) => {
      draft.isAutorunEnabled = isAutorunEnabled
    }),
  )

  .withHandling(
    immerCase(setLogScale, (draft, isLogScale) => {
      draft.isLogScale = isLogScale
    }),
  )

  .withHandling(
    immerCase(setFormatNumbers, (draft, shouldFormatNumbers) => {
      draft.shouldFormatNumbers = shouldFormatNumbers
    }),
  )

  .withHandling(
    immerCase(setResultsMaximized, (draft, areResultsMaximized) => {
      draft.areResultsMaximized = areResultsMaximized
    }),
  )

  .withHandling(
    immerCase(setDisclaimerVersionAccepted, (draft, version) => {
      draft.disclaimerVersionAccepted = version
    }),
  )

  .withHandling(
    immerCase(toggleDisclaimerShouldSuppress, (draft) => {
      draft.disclaimerShouldSuppress = !draft.disclaimerShouldSuppress
    }),
  )
