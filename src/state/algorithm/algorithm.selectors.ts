import { isNil } from 'lodash'

import { State } from '../reducer'

export const selectIsRunning = (state: State) => state.algorithm.isRunning

export const selectResult = (state: State) => state.algorithm.result

export const selectHasResult = (state: State): boolean => !isNil(state.algorithm.result?.trajectory)
