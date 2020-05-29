import { Store } from 'redux'

import { State } from './state/reducer'
import { algorithmRunTrigger } from './state/algorithm/algorithm.actions'
import { selectLocaleKey } from './state/settings/settings.selectors'

import { i18nInit } from './i18n/i18n'

export interface InitializeParams {
  store: Store
}

export async function initialize({ store }: InitializeParams) {
  const state: State = store.getState()
  const { dispatch } = store

  const localeKey = selectLocaleKey(state)
  await i18nInit({ localeKey })

  dispatch(algorithmRunTrigger())
}
