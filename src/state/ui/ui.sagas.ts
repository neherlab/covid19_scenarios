import { select, takeEvery, put } from 'redux-saga/effects'

import { push } from 'connected-next-router'
import urlJoin from 'proper-url-join'

import type { ScenarioParameters } from '../../algorithms/types/Param.types'
import { toUrl } from '../../io/serialization/toUrl'
import { selectScenarioParameters } from '../scenario/scenario.selectors'
import { newTabOpenTrigger, printPreviewOpenTrigger } from './ui.actions'

export function* newTabOpen() {
  const data = ((yield select(selectScenarioParameters)) as unknown) as ScenarioParameters
  const scenarioUrl = decodeURI(urlJoin(window?.location.href, toUrl(data)))
  window?.open(scenarioUrl, '_blank')
}

export function* printPreviewOpen() {
  yield put(push('/print'))
}

export default [takeEvery(newTabOpenTrigger, newTabOpen), takeEvery(printPreviewOpenTrigger, printPreviewOpen)]
