import { debounce } from 'lodash'
import { AnyAction } from 'typescript-fsa'
import { AllParams } from '../../../../algorithms/types/Param.types'
import { defaultScenarioState } from '../state'
import { updateURL } from './updateURL'
import { updateGraphs } from './updateGraphs'
import LocalStorage, { LOCAL_STORAGE_KEYS } from '../../../../helpers/localStorage'

const UPDATE_URL_DEBOUNCE_DELAY = LocalStorage.get<number>(LOCAL_STORAGE_KEYS.UPDATE_URL_DEBOUNCE_DELAY) || 100 // ms
const UPDATE_GRAPHS_DEBOUNCE_DELAY = LocalStorage.get<number>(LOCAL_STORAGE_KEYS.UPDATE_GRAPHS_DEBOUNCE_DELAY) || 500 // ms

let debugOn = false
let dispatchMethod: React.Dispatch<AnyAction>
let params: AllParams = {
  ...defaultScenarioState.data,
}

const debug = (...args: unknown[]) => {
  if (debugOn) {
    // eslint-disable-next-line no-console
    console.log(...args)
  }
}

const updateURLDebounced = debounce((params: AllParams) => {
  debug('    Delay.updateURLDebounced', params)
  updateURL(params)
}, UPDATE_URL_DEBOUNCE_DELAY)

const updateGraphsDebounced = debounce((oldParams: AllParams, newParams: AllParams) => {
  debug('    Delay.updateGraphsDebounced', { oldParams, newParams })
  updateGraphs(dispatchMethod, oldParams, newParams)
}, UPDATE_GRAPHS_DEBOUNCE_DELAY)

/**
 * Singleton
 */
const Delay = {
  /**
   * Connects to dispatch method
   */
  connect: (dispatch: React.Dispatch<AnyAction>) => {
    debug('Delay.connect')
    debug(`    ${LOCAL_STORAGE_KEYS.UPDATE_URL_DEBOUNCE_DELAY}: ${UPDATE_URL_DEBOUNCE_DELAY}`)
    debug(`    ${LOCAL_STORAGE_KEYS.UPDATE_GRAPHS_DEBOUNCE_DELAY}: ${UPDATE_GRAPHS_DEBOUNCE_DELAY}`)
    dispatchMethod = dispatch
  },

  /**
   * Clean-up
   */
  disconnect: () => {
    debug('Delay.disconnect')
    updateURLDebounced.cancel()
    updateGraphsDebounced.cancel()
    dispatchMethod = null
    params = null
  },

  /**
   * Triggers the delay line with new params
   */
  trigger: (newParams: AllParams) => {
    debug('Delay.trigger', newParams)
    const oldParams = params
    updateURLDebounced(newParams)
    updateGraphsDebounced(oldParams, newParams)
    params = newParams
  },

  /**
   * Sets new params silently
   */
  setParams: (newParams: AllParams) => {
    debug('Delay.setParams', newParams)
    params = newParams
  },

  /**
   * Gets latest params
   */
  getLatestParams: (): AllParams => {
    debug('Delay.latestParams')
    return params
  },

  /**
   * Sets debug on/off
   */
  setDebug: (debug: boolean) => {
    debugOn = debug
  },
}

export default Delay
