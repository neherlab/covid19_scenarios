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

import { CUSTOM_SCENARIO_NAME, CUSTOM_COUNTRY_NAME, defaultScenarioState } from './state'

function maybeAdd<T>(where: T[], what: T): T[] {
  return _.uniq([...where, what])
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
    }),
  )

  .withHandling(
    immerCase(setScenario, (draft, { name }) => {
      draft.scenarios = maybeAdd(draft.scenarios, CUSTOM_SCENARIO_NAME)
      draft.current = name
      if (name !== CUSTOM_SCENARIO_NAME) {
        draft.data = _.cloneDeep(getScenario(name))
        draft.ageDistribution = getAgeDistribution(draft.data.population.ageDistributionName)
      }
    }),
  )

  .withHandling(
    immerCase(setPopulationData, (draft, { data }) => {
      draft.scenarios = maybeAdd(draft.scenarios, CUSTOM_SCENARIO_NAME)
      draft.current = CUSTOM_SCENARIO_NAME
      draft.data.population = _.cloneDeep(data)
      if (draft.data.population.ageDistributionName !== CUSTOM_COUNTRY_NAME) {
        draft.ageDistribution = getAgeDistribution(draft.data.population.ageDistributionName)
      }
    }),
  )

  .withHandling(
    immerCase(setEpidemiologicalData, (draft, { data }) => {
      draft.scenarios = maybeAdd(draft.scenarios, CUSTOM_SCENARIO_NAME)
      draft.current = CUSTOM_SCENARIO_NAME
      draft.data.epidemiological = _.cloneDeep(data)
    }),
  )

  .withHandling(
    immerCase(setMitigationData, (draft, { data }) => {
      draft.scenarios = maybeAdd(draft.scenarios, CUSTOM_SCENARIO_NAME)
      draft.current = CUSTOM_SCENARIO_NAME
      draft.data.mitigation.mitigationIntervals = _.cloneDeep(data.mitigationIntervals)
    }),
  )

  .withHandling(
    immerCase(setSimulationData, (draft, { data }) => {
      draft.scenarios = maybeAdd(draft.scenarios, CUSTOM_SCENARIO_NAME)
      draft.current = CUSTOM_SCENARIO_NAME
      draft.data.simulation = _.cloneDeep(data)
    }),
  )

  .withHandling(
    immerCase(setAgeDistributionData, (draft, { data }) => {
      draft.scenarios = maybeAdd(draft.scenarios, CUSTOM_SCENARIO_NAME)
      draft.current = CUSTOM_SCENARIO_NAME
      draft.ageDistribution = data
      draft.data.population.ageDistributionName = CUSTOM_COUNTRY_NAME
    }),
  )

  .withHandling(
    immerCase(setStateData, (draft, { current, data, ageDistribution }) => {
      draft.scenarios = maybeAdd(draft.scenarios, current)
      draft.current = current
      draft.data = data
      draft.ageDistribution = ageDistribution
    }),
  )
