import { push } from 'connected-react-router'
import { select, takeEvery } from 'redux-saga/effects'

import urlJoin from 'proper-url-join'

import { toUrl } from '../../io/serialization/toUrl'

import { selectScenarioData } from '../scenario/scenario.selectors'

import { newTabOpenTrigger, printPreviewOpenTrigger } from './ui.actions'

export function* newTabOpen() {
  const data = yield select(selectScenarioData)
  const scenarioUrl = decodeURI(urlJoin(window?.location.href, toUrl(data)))
  window?.open(scenarioUrl, '_blank')
}

export function* printPreviewOpen() {
  yield push('/print')
}

export default [takeEvery(newTabOpenTrigger, newTabOpen), takeEvery(printPreviewOpenTrigger, printPreviewOpen)]
