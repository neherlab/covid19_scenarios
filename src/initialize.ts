import { State } from './state/reducer'
import { selectLocaleKey } from './state/settings/settings.selectors'

import { i18nInit } from './i18n/i18n'
import { configureStore } from './state/store'

export async function initialize() {
  const { persistor, history, store } = await configureStore()

  const state: State = store.getState()

  const localeKey = selectLocaleKey(state)
  const i18n = await i18nInit({ localeKey })

  return { persistor, history, store, i18n }
}
