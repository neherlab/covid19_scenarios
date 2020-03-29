import actionCreatorFactory from 'typescript-fsa'

const action = actionCreatorFactory('SETTINGS')

export interface AutorunSettingsParams {
  autorunSimulation: boolean
}

export interface LogScaleSettingsParams {
  logScale: boolean
}

export interface ShowHumanizedSettingsParams {
  showHumanized: boolean
}

export const setAutorunSimulation = action<AutorunSettingsParams>('SETTINGS_SET_AUTORUN_SIMULATION')

export const setLogScale = action<LogScaleSettingsParams>('SETTINGS_SET_LOG_SCALE')

export const setShowHumanized = action<ShowHumanizedSettingsParams>('SETTINGS_SET_SHOW_HUMANIZED')
