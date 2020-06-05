import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { getCaseCountsData } from '../../io/defaults/getCaseCountsData'

import immerCase from '../util/fsaImmerReducer'

import { CUSTOM_COUNTRY_NAME } from '../../constants'

import {
  renameCurrentScenario,
  setAgeDistributionData,
  setCanRun,
  setScenario,
  setScenarioData,
  setScenarioState,
  setSeverityDistributionData,
  setCaseCountsData,
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
      draft.caseCountsData = getCaseCountsData(draft.scenarioData.data.population.caseCountsName)
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
    immerCase(setCaseCountsData, (draft, data) => {
      draft.caseCountsData = data
    }),
  )

  .withHandling(
    immerCase(setScenarioState, (draft, { scenarioData, ageDistributionData, severityDistributionData }) => {
      draft.scenarioData = scenarioData
      draft.shouldRenameOnEdits = false
      draft.ageDistributionData = ageDistributionData
      draft.caseCountsData = getCaseCountsData(scenarioData.data.population.caseCountsName)
    }),
  )

  .withHandling(
    immerCase(setCanRun, (draft, canRun) => {
      draft.canRun = canRun
    }),
  )
