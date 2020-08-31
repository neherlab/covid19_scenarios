import { takeEvery, call } from 'redux-saga/effects'

import { Action } from 'src/state/util/fsaActions'

import i18n, { changeLocale, LocaleKey } from '../../i18n/i18n'
import { setLocale } from './settings.actions'

export function* onSetLocale({ payload }: Action<LocaleKey>) {
  yield call(changeLocale, i18n, payload)
}

export default [takeEvery(setLocale, onSetLocale)]
