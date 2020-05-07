import _ from 'lodash'

import { reducerWithInitialState } from 'typescript-fsa-reducers'

import immerCase from '../../../state/util/fsaImmerReducer'

import {
  setPopulationData,
  setEpidemiologicalData,
  setMitigationData,
  setSimulationData,
  setScenario,
  setAgeDistributionData,
  setStateData,
  renameCurrentScenario,
} from './actions'

import { getScenario } from './getScenario'
import { getAgeDistribution } from './getAgeDistribution'

import { CUSTOM_COUNTRY_NAME, defaultScenarioState, State } from './state'

export function maybeChangeTitle(state: State) {
  let name = state.current
  if (state.shouldRenameOnEdits) {
    name = `${name} (edited)`
  }
  return name
}

/**
 * Reducer. Accepts a previous state object and and an action object.
 * Returns a new state object.
 * The previous state is immutable (modification is forbidden).
 *
 *
 * Implementation:
 *
 * Here we use `immer` library and its `draft` proxy object for the previous
 * state. That allows to write mutable code (`draft` is being mutated).
 * However, `immer` will internally assemble a new state object from the
 * resulting draft leaving the previous state unmodified.
 *
 * `typescript-fsa-reducers` library is used to split the cases into compact
 * blocks (per action type) and to enforce typing.
 *
 */
export const scenarioReducer = reducerWithInitialState(defaultScenarioState)
  .withHandling(
    immerCase(renameCurrentScenario, (draft, { name }) => {
      draft.current = name
      draft.shouldRenameOnEdits = false
    }),
  )

  .withHandling(
    immerCase(setScenario, (draft, { name }) => {
      draft.current = maybeChangeTitle(draft)
      draft.shouldRenameOnEdits = false
      draft.data = _.cloneDeep(getScenario(name))
      draft.ageDistribution = getAgeDistribution(draft.data.population.ageDistributionName)
    }),
  )

  .withHandling(
    immerCase(setPopulationData, (draft, { data }) => {
      draft.current = maybeChangeTitle(draft)
      draft.shouldRenameOnEdits = false
      draft.data.population = _.cloneDeep(data)
      if (draft.data.population.ageDistributionName !== CUSTOM_COUNTRY_NAME) {
        draft.ageDistribution = getAgeDistribution(draft.data.population.ageDistributionName)
      }
    }),
  )

  .withHandling(
    immerCase(setEpidemiologicalData, (draft, { data }) => {
      draft.current = maybeChangeTitle(draft)
      draft.shouldRenameOnEdits = false
      draft.data.epidemiological = _.cloneDeep(data)
    }),
  )

  .withHandling(
    immerCase(setMitigationData, (draft, { data }) => {
      draft.current = maybeChangeTitle(draft)
      draft.shouldRenameOnEdits = false
      draft.data.mitigation.mitigationIntervals = _.cloneDeep(data.mitigationIntervals)
    }),
  )

  .withHandling(
    immerCase(setSimulationData, (draft, { data }) => {
      draft.current = maybeChangeTitle(draft)
      draft.shouldRenameOnEdits = false
      draft.data.simulation = _.cloneDeep(data)
    }),
  )

  .withHandling(
    immerCase(setAgeDistributionData, (draft, { data }) => {
      draft.current = maybeChangeTitle(draft)
      draft.shouldRenameOnEdits = false
      draft.ageDistribution = data
      draft.data.population.ageDistributionName = CUSTOM_COUNTRY_NAME
    }),
  )

  .withHandling(
    immerCase(setStateData, (draft, { current, data, shouldRenameOnEdits, ageDistribution }) => {
      draft.current = current
      draft.shouldRenameOnEdits = shouldRenameOnEdits
      draft.data = data
      draft.ageDistribution = ageDistribution
    }),
  )
