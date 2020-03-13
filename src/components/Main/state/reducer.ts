import _ from 'lodash'

import { reducerWithInitialState } from 'typescript-fsa-reducers'

import immerCase from '../../../state/util/fsaImmerReducer'

import {
  setContainmentData,
  setContainmentScenario,
  setEpidemiologicalData,
  setEpidemiologicalScenario,
  setOverallScenario,
  setPopulationData,
  setPopulationScenario,
  setSimulationData,
} from './actions'

import { getContainmentScenarioData, getEpidemiologicalData, getOverallScenario, getPopulationData } from './data'

import { CUSTOM_SCENARIO_NAME, defaultScenarioState } from './state'

import { updateTimeSeries } from '../../../algorithms/TimeSeries'

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
    immerCase(setOverallScenario, (draft, { scenarioName }) => {
      draft.overall.scenarios = maybeAdd(draft.overall.scenarios, CUSTOM_SCENARIO_NAME)
      draft.overall.current = scenarioName
      if (scenarioName !== CUSTOM_SCENARIO_NAME) {
        const { containmentScenario, epidemiologicalScenario, populationScenario } = getOverallScenario(scenarioName)

        draft.population.current = populationScenario
        draft.population.data = getPopulationData(populationScenario)

        draft.epidemiological.current = epidemiologicalScenario
        draft.epidemiological.data = getEpidemiologicalData(epidemiologicalScenario)

        draft.containment.current = containmentScenario
        draft.containment.data = getContainmentScenarioData(containmentScenario)
      }
    }),
  )

  .withHandling(
    immerCase(setPopulationScenario, (draft, { scenarioName }) => {
      draft.overall.scenarios = maybeAdd(draft.overall.scenarios, CUSTOM_SCENARIO_NAME)
      draft.overall.current = CUSTOM_SCENARIO_NAME
      draft.population.current = scenarioName
      if (scenarioName !== CUSTOM_SCENARIO_NAME) {
        draft.population.data = getPopulationData(scenarioName)
      }
    }),
  )

  .withHandling(
    immerCase(setEpidemiologicalScenario, (draft, { scenarioName }) => {
      draft.overall.scenarios = maybeAdd(draft.overall.scenarios, CUSTOM_SCENARIO_NAME)
      draft.overall.current = CUSTOM_SCENARIO_NAME
      draft.epidemiological.current = scenarioName
      if (scenarioName !== CUSTOM_SCENARIO_NAME) {
        draft.epidemiological.data = getEpidemiologicalData(scenarioName)
      }
    }),
  )

  .withHandling(
    immerCase(setContainmentScenario, (draft, { scenarioName }) => {
      draft.overall.scenarios = maybeAdd(draft.overall.scenarios, CUSTOM_SCENARIO_NAME)
      draft.overall.current = CUSTOM_SCENARIO_NAME
      draft.containment.current = scenarioName
      if (scenarioName !== CUSTOM_SCENARIO_NAME) {
        draft.containment.data = getContainmentScenarioData(scenarioName)
      }
    }),
  )

  .withHandling(
    immerCase(setPopulationData, (draft, { data }) => {
      draft.overall.scenarios = maybeAdd(draft.overall.scenarios, CUSTOM_SCENARIO_NAME)
      draft.overall.current = CUSTOM_SCENARIO_NAME
      draft.population.scenarios = maybeAdd(draft.population.scenarios, CUSTOM_SCENARIO_NAME)
      draft.population.current = CUSTOM_SCENARIO_NAME
      draft.population.data = data
    }),
  )

  .withHandling(
    immerCase(setEpidemiologicalData, (draft, { data }) => {
      draft.overall.scenarios = maybeAdd(draft.overall.scenarios, CUSTOM_SCENARIO_NAME)
      draft.overall.current = CUSTOM_SCENARIO_NAME
      draft.epidemiological.scenarios = maybeAdd(draft.epidemiological.scenarios, CUSTOM_SCENARIO_NAME)
      draft.epidemiological.current = CUSTOM_SCENARIO_NAME
      draft.epidemiological.data = data
    }),
  )

  .withHandling(
    immerCase(setContainmentData, (draft, { data }) => {
      draft.overall.scenarios = maybeAdd(draft.overall.scenarios, CUSTOM_SCENARIO_NAME)
      draft.overall.current = CUSTOM_SCENARIO_NAME
      draft.containment.scenarios = maybeAdd(draft.containment.scenarios, CUSTOM_SCENARIO_NAME)
      draft.containment.current = CUSTOM_SCENARIO_NAME
      draft.containment.data = data
    }),
  )

  .withHandling(
    immerCase(setSimulationData, (draft, { data }) => {
      draft.simulation.data = data
      draft.containment.data.reduction = updateTimeSeries(data.simulationTimeRange, draft.containment.data.reduction)
    }),
  )
