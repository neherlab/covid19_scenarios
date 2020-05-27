import { push } from 'connected-react-router'
import urlJoin from 'proper-url-join'
import { select, takeEvery, put } from 'redux-saga/effects'

import { toUrl } from '../../io/serialization/toUrl'

import { selectScenarioData } from '../scenario/scenario.selectors'

import { newTabOpenTrigger, printPreviewOpenTrigger } from './ui.actions'

export function* newTabOpen() {
  const data = yield select(selectScenarioData)
  const scenarioUrl = decodeURI(urlJoin(window?.location.href, toUrl(data)))
  window?.open(scenarioUrl, '_blank')
}

export function* printPreviewOpen() {
  yield put(push('/print'))
}

export default [takeEvery(newTabOpenTrigger, newTabOpen), takeEvery(printPreviewOpenTrigger, printPreviewOpen)]
