import _ from 'lodash'

import { reducerWithInitialState } from 'typescript-fsa-reducers'

import immerCase from '../../../state/util/fsaImmerReducer'

import {
  setPopulationData,
  setEpidemiologicalData,
  setContainmentData,
  setSimulationData,
  setScenario,
  setAgeDistributionData,
} from './actions'

import { getScenarioData } from './scenarioData'
import { getCountryAgeDistribution } from './countryAgeDistributionData'

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
    immerCase(setScenario, (draft, { name }) => {
      draft.scenarios = maybeAdd(draft.scenarios, CUSTOM_SCENARIO_NAME)
      draft.current = name
      if (name !== CUSTOM_SCENARIO_NAME) {
        draft.data = _.cloneDeep(getScenarioData(name))
        draft.ageDistribution = getCountryAgeDistribution(draft.data.population.country)
      }
    }),
  )

  .withHandling(
    immerCase(setPopulationData, (draft, { data }) => {
      draft.scenarios = maybeAdd(draft.scenarios, CUSTOM_SCENARIO_NAME)
      draft.current = CUSTOM_SCENARIO_NAME
      draft.data.population = _.cloneDeep(data)
      if (draft.data.population.country !== CUSTOM_COUNTRY_NAME) {
        draft.ageDistribution = getCountryAgeDistribution(draft.data.population.country)
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
    immerCase(setContainmentData, (draft, { data }) => {
      draft.scenarios = maybeAdd(draft.scenarios, CUSTOM_SCENARIO_NAME)
      draft.current = CUSTOM_SCENARIO_NAME
      draft.data.containment = _.cloneDeep(data)
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
      draft.data.population.country = CUSTOM_COUNTRY_NAME
    }),
  )
