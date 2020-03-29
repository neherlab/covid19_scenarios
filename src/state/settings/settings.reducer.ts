import { Action } from 'redux'
import { isType } from 'typescript-fsa'

import LocalStorage, { LOCAL_STORAGE_KEYS } from '../../helpers/localStorage'
import { setAutorunSimulation, setLogScale, setShowHumanized } from './settings.actions'

export interface SettingsState {
  autorunSimulation: boolean
  logScale: boolean
  showHumanized: boolean
}

const AUTORUN_SIMULTAION_DEFAULT = false
const LOG_SCALE_DEFAULT = true
const SHOW_HUMANIZED_DEFAULT = true

export const settingsDefaultState: SettingsState = {
  autorunSimulation: Boolean(LocalStorage.get(LOCAL_STORAGE_KEYS.AUTORUN_SIMULATION ?? AUTORUN_SIMULTAION_DEFAULT)),
  logScale: Boolean(LocalStorage.get(LOCAL_STORAGE_KEYS.LOG_SCALE) ?? LOG_SCALE_DEFAULT),
  showHumanized: Boolean(LocalStorage.get(LOCAL_STORAGE_KEYS.SHOW_HUMANIZED_RESULTS) ?? SHOW_HUMANIZED_DEFAULT),
}

export function settingsReducer(state: SettingsState = settingsDefaultState, action: Action) {
  if (isType(action, setAutorunSimulation)) {
    LocalStorage.set(LOCAL_STORAGE_KEYS.AUTORUN_SIMULATION, action.payload.autorunSimulation)
    return { ...state, autorunSimulation: action.payload.autorunSimulation }
  }

  if (isType(action, setLogScale)) {
    LocalStorage.set(LOCAL_STORAGE_KEYS.LOG_SCALE, action.payload.logScale)
    return { ...state, logScale: action.payload.logScale }
  }

  if (isType(action, setShowHumanized)) {
    LocalStorage.set(LOCAL_STORAGE_KEYS.SHOW_HUMANIZED_RESULTS, action.payload.showHumanized)
    return { ...state, showHumanized: action.payload.showHumanized }
  }

  return state
}
