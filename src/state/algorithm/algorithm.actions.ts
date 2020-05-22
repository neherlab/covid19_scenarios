import actionCreatorFactory from 'typescript-fsa'

import type { AlgorithmResult } from '../../algorithms/types/Result.types'
import type { RunParams } from '../../algorithms/run'

const action = actionCreatorFactory('ALGORITHM')

export const algorithmRunTrigger = action('RUN_TRIGGER')

export interface AlgorithmRunParams {
  params: RunParams
}

export interface AlgorithmRunResults {
  result: AlgorithmResult
}

export interface AlgorithmRunError {
  error: Error
}

export const algorithmRunAsync = action.async<void, AlgorithmRunResults, AlgorithmRunError>('RUN')

export const setResults = action<AlgorithmRunResults>('SET_RESULTS')
