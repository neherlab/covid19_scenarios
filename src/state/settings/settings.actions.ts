import actionCreatorFactory from 'typescript-fsa'

const action = actionCreatorFactory('SETTINGS')

export const toggleAutorun = action('TOGGLE_AUTORUN')
export const toggleLogScale = action('TOGGLE_LOG_SCALE')
export const toggleFormatNumbers = action('TOGGLE_FORMAT_NUMBERS')
export const toggleResultsMaximized = action('TOGGLE_RESULTS_MAXIMIZED')

export const setAutorun = action<boolean>('SET_AUTORUN')
export const setLogScale = action<boolean>('SET_LOG_SCALE')
export const setFormatNumbers = action<boolean>('SET_FORMAT_NUMBERS')
export const setResultsMaximized = action<boolean>('SET_RESULTS_MAXIMIZED')
