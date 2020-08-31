import type { Router } from 'next/router'

import { configureStore } from 'src/state/store'

export interface InitializeParams {
  router: Router
}

export async function initialize({ router }: InitializeParams) {
  const { persistor, store } = await configureStore({ router })
  return { persistor, store }
}
