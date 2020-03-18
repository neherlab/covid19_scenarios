import { State } from '../reducer'

export function selectAlgorithmsCanRun(state: State) {
  return state.algorithm.canRun
}

export function selectAlgorithmResult(state: State) {
  return state.algorithm.result
}

export function selectAlgorithmError(state: State) {
  return state.algorithm.error
}

export function selectAlgorithmIsRunning(state: State) {
  return state.algorithm.running > 0
}
