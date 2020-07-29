import type { Router } from 'next/router'

import { configureStore } from 'src/state/store'
import { algorithmRunTrigger } from 'src/state/algorithm/algorithm.actions'

export interface InitializeParams {
  router: Router
}

export async function initialize({ router }: InitializeParams) {
  const { persistor, store } = await configureStore({ router })
  const { dispatch } = store
  dispatch(algorithmRunTrigger())
  return { persistor, store }
}
