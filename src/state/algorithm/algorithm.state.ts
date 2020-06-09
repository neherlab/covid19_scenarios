import { AlgorithmResult } from '../../algorithms/types/Result.types'

export interface AlgorithmState {
  isRunning: boolean
  result?: AlgorithmResult
}

export const defaultAlgorithmState: AlgorithmState = {
  isRunning: false,
  result: undefined,
}
