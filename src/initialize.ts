import type { Router } from 'next/router'

import { configureStore } from 'src/state/store'
import { setLocale } from 'src/state/settings/settings.actions'

export interface InitializeParams {
  router: Router
}

export async function initialize({ router }: InitializeParams) {
  const { persistor, store } = await configureStore({ router })

  const { localeKey } = store.getState().settings
  store.dispatch(setLocale(localeKey))

  return { persistor, store }
}
