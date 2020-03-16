import { AlgorithmResult } from '../../algorithms/Result.types'

export interface AlgorithmState {
  running: number
  result: AlgorithmResult | null
  error: Error | null
}

export const defaultAlgorithmState: AlgorithmState = {
  running: 0,
  result: null,
  error: null,
}
