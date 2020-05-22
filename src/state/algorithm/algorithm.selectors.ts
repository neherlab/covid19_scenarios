import { State } from '../reducer'

export const selectIsRunning = (state: State) => state.algorithm.isRunning
