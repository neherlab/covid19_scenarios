import { State } from './state/reducer'
import { algorithmRunTrigger } from './state/algorithm/algorithm.actions'
import { selectLocaleKey } from './state/settings/settings.selectors'

import { i18nInit } from './i18n/i18n'
import { configureStore } from './state/store'

export async function initialize() {
  const { persistor, history, store } = await configureStore()

  const state: State = store.getState()
  const { dispatch } = store

  const localeKey = selectLocaleKey(state)
  const i18n = await i18nInit({ localeKey })

  dispatch(algorithmRunTrigger())

  return { persistor, history, store, i18n }
}
