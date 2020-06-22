import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { suggestNextMitigationInterval } from '../../algorithms/utils/suggestNextMitigationInterval'
import { getCaseCountsData } from '../../io/defaults/getCaseCountsData'

import immerCase from '../util/fsaImmerReducer'

import { CUSTOM_COUNTRY_NAME } from '../../constants'

import {
  addMitigationInterval,
  removeMitigationInterval,
  renameCurrentScenario,
  resetCaseCounts,
  setAgeDistributionData,
  setCanRun,
  setCaseCountsDataCustom,
  setScenario,
  setScenarioData,
  setScenarioState,
  setSeverityDistributionData,
} from './scenario.actions'

import { getAgeDistributionData } from '../../io/defaults/getAgeDistributionData'
import { getScenarioData } from '../../io/defaults/getScenarioData'

import { ScenarioState, defaultScenarioState } from './scenario.state'

export function maybeChangeTitle(state: ScenarioState) {
  let { name } = state.scenarioData
  if (state.shouldRenameOnEdits) {
    name = `${name} (edited)`
  }
  return name
}

export const scenarioReducer = reducerWithInitialState(defaultScenarioState)
  .withHandling(
    immerCase(renameCurrentScenario, (draft, { name }) => {
      draft.scenarioData.name = name
      draft.shouldRenameOnEdits = false
    }),
  )

  .withHandling(
    immerCase(setScenario, (draft, { name }) => {
      draft.scenarioData.name = name
      draft.shouldRenameOnEdits = true
      draft.scenarioData = getScenarioData(name)
      draft.ageDistributionData = getAgeDistributionData(draft.scenarioData.data.population.ageDistributionName)
      draft.caseCountsNameCustom = undefined
      draft.caseCountsData = getCaseCountsData(draft.scenarioData.data.population.caseCountsName)
    }),
  )

  .withHandling(
    immerCase(setScenarioData, (draft, data) => {
      draft.scenarioData.name = maybeChangeTitle(draft)
      draft.shouldRenameOnEdits = false
      draft.scenarioData.data = data
      if (draft.scenarioData.data.population.ageDistributionName !== CUSTOM_COUNTRY_NAME) {
        draft.ageDistributionData = getAgeDistributionData(draft.scenarioData.data.population.ageDistributionName)
      }

      if (!draft.caseCountsNameCustom) {
        draft.caseCountsData = getCaseCountsData(draft.scenarioData.data.population.caseCountsName)
      }
    }),
  )

  .withHandling(
    immerCase(setAgeDistributionData, (draft, data) => {
      draft.scenarioData.name = maybeChangeTitle(draft)
      draft.shouldRenameOnEdits = false
      draft.ageDistributionData.data = data

      // FIXME: these are duplicated
      draft.ageDistributionData.name = CUSTOM_COUNTRY_NAME
      draft.scenarioData.data.population.ageDistributionName = CUSTOM_COUNTRY_NAME
    }),
  )

  .withHandling(
    immerCase(setSeverityDistributionData, (draft, data) => {
      draft.scenarioData.name = maybeChangeTitle(draft)
      draft.shouldRenameOnEdits = false
      draft.severityDistributionData.data = data
      draft.severityDistributionData.name = CUSTOM_COUNTRY_NAME
    }),
  )

  .withHandling(
    immerCase(setCaseCountsDataCustom, (draft, data) => {
      draft.caseCountsData = data
      draft.caseCountsNameCustom = data.name
    }),
  )

  .withHandling(
    immerCase(resetCaseCounts, (draft) => {
      draft.caseCountsData = getCaseCountsData(draft.scenarioData.data.population.caseCountsName)
      draft.caseCountsNameCustom = undefined
    }),
  )

  .withHandling(
    immerCase(setScenarioState, (draft, { scenarioData, ageDistributionData, severityDistributionData }) => {
      draft.scenarioData = scenarioData
      draft.shouldRenameOnEdits = false
      draft.ageDistributionData = ageDistributionData
      draft.severityDistributionData = severityDistributionData
      draft.caseCountsData = getCaseCountsData(scenarioData.data.population.caseCountsName)
      draft.caseCountsNameCustom = undefined
    }),
  )

  .withHandling(
    immerCase(addMitigationInterval, (draft) => {
      draft.scenarioData.data.mitigation.mitigationIntervals.push(suggestNextMitigationInterval())
    }),
  )

  .withHandling(
    immerCase(removeMitigationInterval, (draft, id) => {
      // prettier-ignore
      draft.scenarioData.data.mitigation.mitigationIntervals =
        draft.scenarioData.data.mitigation.mitigationIntervals.filter((interval) => interval.id !== id)
    }),
  )

  .withHandling(
    immerCase(setCanRun, (draft, canRun) => {
      draft.canRun = canRun
    }),
  )
