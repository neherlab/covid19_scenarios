import { select, takeEvery, put, call } from 'redux-saga/effects'

import { push } from 'connected-react-router'
import urlJoin from 'proper-url-join'
import { Action } from 'typescript-fsa'

import { Locale, changeLocale } from '../../i18n/i18n'
import { toUrl } from '../../io/serialization/toUrl'
import { selectScenarioData } from '../scenario/scenario.selectors'
import { newTabOpenTrigger, printPreviewOpenTrigger, setLocale } from './ui.actions'

export function* newTabOpen() {
  const data = yield select(selectScenarioData)
  const scenarioUrl = decodeURI(urlJoin(window?.location.href, toUrl(data)))
  window?.open(scenarioUrl, '_blank')
}

export function* printPreviewOpen() {
  yield put(push('/print'))
}

export function* onSetLocale({ payload }: Action<Locale>) {
  yield call(changeLocale, payload)
}

export default [
  takeEvery(newTabOpenTrigger, newTabOpen),
  takeEvery(printPreviewOpenTrigger, printPreviewOpen),
  takeEvery(setLocale, onSetLocale),
]
