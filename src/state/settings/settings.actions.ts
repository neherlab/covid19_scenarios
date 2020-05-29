import actionCreatorFactory from 'typescript-fsa'

import type { Locale } from '../../i18n/i18n'

const action = actionCreatorFactory('SETTINGS')

export const toggleAutorun = action('TOGGLE_AUTORUN')
export const toggleLogScale = action('TOGGLE_LOG_SCALE')
export const toggleFormatNumbers = action('TOGGLE_FORMAT_NUMBERS')
export const toggleResultsMaximized = action('TOGGLE_RESULTS_MAXIMIZED')

export const setAutorun = action<boolean>('SET_AUTORUN')
export const setLogScale = action<boolean>('SET_LOG_SCALE')
export const setFormatNumbers = action<boolean>('SET_FORMAT_NUMBERS')
export const setResultsMaximized = action<boolean>('SET_RESULTS_MAXIMIZED')

export const setDisclaimerVersionAccepted = action<number>('SET_DISCLAIMER_VERSION_ACCEPTED')
export const toggleDisclaimerShouldSuppress = action('TOGGLE_DISCLAIMER_SHOULD_SUPPRESS')

export const setLocale = action<Locale>('SET_LOCALE')
