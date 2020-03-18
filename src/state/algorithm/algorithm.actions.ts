import actionCreatorFactory from 'typescript-fsa'

import { AlgorithmResult } from '../../algorithms/Result.types'

const action = actionCreatorFactory('ALGORITHM')

export interface SetCanRunParams {
  canRun: boolean
}

export const setCanRun = action<SetCanRunParams>('SET_CAN_RUN')

export interface RunAlgorithmAsyncResult {
  result: AlgorithmResult
}

export const triggerAlgorithm = action('TRIGGER')
export const runAlgorithmAsync = action.async<void, AlgorithmResult, Error>('RUN')
