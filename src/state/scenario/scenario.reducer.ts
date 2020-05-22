import { reducerWithInitialState } from 'typescript-fsa-reducers'

import immerCase from '../util/fsaImmerReducer'

import {
  renameCurrentScenario,
  setAgeDistributionData,
  setEpidemiologicalData,
  setMitigationData,
  setPopulationData,
  setScenario,
  setScenarioState,
  setSeverityDistributionData,
  setSimulationData,
} from './scenario.actions'

import { getAgeDistributionData } from './getAgeDistributionData'
import { getScenarioData } from './getScenarioData'

import { ScenarioState, defaultScenarioState, CUSTOM_COUNTRY_NAME } from './scenario.state'

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
    }),
  )

  .withHandling(
    immerCase(setPopulationData, (draft, { data }) => {
      draft.scenarioData.name = maybeChangeTitle(draft)
      draft.shouldRenameOnEdits = false
      draft.scenarioData.data.population = data
      if (draft.scenarioData.data.population.ageDistributionName !== CUSTOM_COUNTRY_NAME) {
        draft.ageDistributionData = getAgeDistributionData(draft.scenarioData.data.population.ageDistributionName)
      }
    }),
  )

  .withHandling(
    immerCase(setEpidemiologicalData, (draft, { data }) => {
      draft.scenarioData.name = maybeChangeTitle(draft)
      draft.shouldRenameOnEdits = false
      draft.scenarioData.data.epidemiological = data
    }),
  )

  .withHandling(
    immerCase(setMitigationData, (draft, { data }) => {
      draft.scenarioData.name = maybeChangeTitle(draft)
      draft.shouldRenameOnEdits = false
      draft.scenarioData.data.mitigation = data
    }),
  )

  .withHandling(
    immerCase(setSimulationData, (draft, { data }) => {
      draft.scenarioData.name = maybeChangeTitle(draft)
      draft.shouldRenameOnEdits = false
      draft.scenarioData.data.simulation = data
    }),
  )

  .withHandling(
    immerCase(setAgeDistributionData, (draft, { data }) => {
      draft.scenarioData.name = maybeChangeTitle(draft)
      draft.shouldRenameOnEdits = false
      draft.ageDistributionData.data = data

      // FIXME: these are duplicated
      draft.ageDistributionData.name = CUSTOM_COUNTRY_NAME
      draft.scenarioData.data.population.ageDistributionName = CUSTOM_COUNTRY_NAME
    }),
  )

  .withHandling(
    immerCase(setSeverityDistributionData, (draft, { data }) => {
      draft.scenarioData.name = maybeChangeTitle(draft)
      draft.shouldRenameOnEdits = false
      draft.severityDistributionData.data = data

      // FIXME: these are duplicated
      draft.severityDistributionData.name = CUSTOM_COUNTRY_NAME
      draft.severityDistributionData.name = CUSTOM_COUNTRY_NAME
    }),
  )

  .withHandling(
    immerCase(
      setScenarioState,
      (draft, { scenarioData, ageDistributionData, severityDistributionData, shouldRenameOnEdits }) => {
        draft.scenarioData = scenarioData
        draft.shouldRenameOnEdits = shouldRenameOnEdits
        draft.ageDistributionData = ageDistributionData
      },
    ),
  )
