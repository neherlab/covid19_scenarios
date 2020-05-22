import { State } from '../reducer'

export const selectIsRunning = (state: State) => state.algorithm.isRunning

export const selectResult = (state: State) => state.algorithm.result
