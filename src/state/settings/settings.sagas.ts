import { takeEvery, call, put } from 'typed-redux-saga'

import { Action } from 'typescript-fsa'

import i18n, { changeLocale, DEFAULT_LOCALE_KEY, LocaleKey } from '../../i18n/i18n'
import { setLocale } from './settings.actions'

export function* onSetLocale({ payload }: Action<LocaleKey>) {
  const localeKey = payload

  const localeChangedSuccessfully = yield* call(changeLocale, i18n, localeKey)
  if (!localeChangedSuccessfully) {
    yield* put(setLocale(DEFAULT_LOCALE_KEY))
  }
}

export default [takeEvery(setLocale, onSetLocale)]
