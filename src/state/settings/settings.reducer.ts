import { reducerWithInitialState } from 'src/state/util/fsaReducer'

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
  setLocale,
} from './settings.actions'

import { settingsDefaultState } from './settings.state'

export const settingsReducer = reducerWithInitialState(settingsDefaultState)
  .icase(toggleAutorun, (draft) => {
    draft.isAutorunEnabled = !draft.isAutorunEnabled
  })

  .icase(toggleLogScale, (draft) => {
    draft.isLogScale = !draft.isLogScale
  })

  .icase(toggleFormatNumbers, (draft) => {
    draft.shouldFormatNumbers = !draft.shouldFormatNumbers
  })

  .icase(toggleResultsMaximized, (draft) => {
    draft.areResultsMaximized = !draft.areResultsMaximized
  })

  .icase(setAutorun, (draft, isAutorunEnabled) => {
    draft.isAutorunEnabled = isAutorunEnabled
  })

  .icase(setLogScale, (draft, isLogScale) => {
    draft.isLogScale = isLogScale
  })

  .icase(setFormatNumbers, (draft, shouldFormatNumbers) => {
    draft.shouldFormatNumbers = shouldFormatNumbers
  })

  .icase(setResultsMaximized, (draft, areResultsMaximized) => {
    draft.areResultsMaximized = areResultsMaximized
  })

  .icase(setDisclaimerVersionAccepted, (draft, version) => {
    draft.disclaimerVersionAccepted = version
  })

  .icase(toggleDisclaimerShouldSuppress, (draft) => {
    draft.disclaimerShouldSuppress = !draft.disclaimerShouldSuppress
  })

  .icase(setLocale, (draft, localeKey) => {
    draft.localeKey = localeKey
  })
