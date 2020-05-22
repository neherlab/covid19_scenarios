import actionCreatorFactory from 'typescript-fsa'

const action = actionCreatorFactory('SETTINGS')

export const toggleAutorun = action('TOGGLE_AUTORUN')
export const toggleLogScale = action('TOGGLE_LOG_SCALE')
export const toggleFormatNumbers = action('TOGGLE_FORMAT_NUMBERS')
export const toggleResultsMaximized = action('TOGGLE_RESULTS_MAXIMIZED')
