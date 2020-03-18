import { AlgorithmResult } from '../../algorithms/Result.types'

export interface AlgorithmState {
  canRun: boolean
  running: number
  result: AlgorithmResult | null
  error: Error | null
}

export const defaultAlgorithmState: AlgorithmState = {
  canRun: false,
  running: 0,
  result: null,
  error: null,
}
