import { select, put, take, race, fork, call, debounce } from 'redux-saga/effects'

import fsaSaga from '../util/fsaSaga'

import { AllParamsFlat } from '../../algorithms/Param.types'
import run from '../../algorithms/run'

import { selectAllDataFlat, selectAgeDistribution } from '../scenario/scenario.selectors'
import { OneCountryAgeDistribution } from '../../assets/data/CountryAgeDistribution.types'
import { triggerAlgorithm, runAlgorithmAsync } from './algorithm.actions'
import {
  setContainmentData,
  setContainmentScenario,
  setEpidemiologicalData,
  setEpidemiologicalScenario,
  setOverallScenario,
  setPopulationData,
  setPopulationScenario,
  setSeverityData,
  setSimulationData,
} from '../scenario/scenario.actions'

const DEFAULT_TRIGGER_ALGORITHM_DEBOUNCE_MS = 250

export function* sagaTriggerAlgorithmOnChanges() {
  // eslint-disable-next-line no-loops/no-loops
  while (true) {
    yield race([
      take(setContainmentData),
      take(setContainmentScenario),
      take(setEpidemiologicalData),
      take(setEpidemiologicalScenario),
      take(setOverallScenario),
      take(setPopulationData),
      take(setPopulationScenario),
      take(setSeverityData),
      take(setSimulationData),
    ])

    yield put(triggerAlgorithm())
  }
}

function* sagaRunAlgorithm() {
  const paramsFlat: AllParamsFlat = yield select(selectAllDataFlat)
  const ageDistribution: OneCountryAgeDistribution = yield select(selectAgeDistribution)
  return yield call(run, paramsFlat, paramsFlat.severityTable, ageDistribution, paramsFlat.reduction)
}

export const sagaRunAlgorithmOnTrigger = debounce(
  DEFAULT_TRIGGER_ALGORITHM_DEBOUNCE_MS,
  triggerAlgorithm,
  fsaSaga(runAlgorithmAsync, sagaRunAlgorithm),
)

export default [fork(sagaTriggerAlgorithmOnChanges), sagaRunAlgorithmOnTrigger]
