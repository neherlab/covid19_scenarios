import { reducerWithInitialState } from 'src/state/util/fsaReducer'

import { algorithmRunAsync } from './algorithm.actions'
import { defaultAlgorithmState } from './algorithm.state'

export const algorithmReducer = reducerWithInitialState(defaultAlgorithmState) // prettier-ignore
  .icase(algorithmRunAsync.started, (state) => {
    state.isRunning = true
  })

  .icase(algorithmRunAsync.done, (state, { result }) => {
    state.isRunning = false
    state.result = result.result
  })

  .icase(algorithmRunAsync.failed, (state) => {
    state.isRunning = false
  })
