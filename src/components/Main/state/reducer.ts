import _ from 'lodash'

import { reducerWithInitialState } from 'typescript-fsa-reducers'

import immerCase from '../../../state/util/fsaImmerReducer'

import {
  setScenarioData,
  setPopulationData,
  setEpidemiologicalData,
  setContainmentData,
  setSimulationData,
  setScenario,
} from './actions'

import { getScenarioData } from './data'

import { CUSTOM_SCENARIO_NAME, defaultScenarioState } from './state'

import { updateTimeSeries } from '../../../algorithms/utils/TimeSeries'

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
        draft.data = getScenarioData(name)
        draft.data.containment = {
          reduction: updateTimeSeries(
            draft.data.simulation.simulationTimeRange,
            draft.data.containment.reduction,
            draft.data.containment.numberPoints,
          ),
          numberPoints: draft.data.containment.numberPoints,
        }
      }
    }),
  )

  .withHandling(
    immerCase(setScenarioData, (draft, { data }) => {
      draft.scenarios = maybeAdd(draft.scenarios, CUSTOM_SCENARIO_NAME)
      draft.current = CUSTOM_SCENARIO_NAME
      draft.data = {
        population: data.population,
        epidemiological: data.epidemiological,
        containment: data.containment,
        simulation: data.simulation,
      }
    }),
  )

  .withHandling(
    immerCase(setPopulationData, (draft, { data }) => {
      draft.scenarios = maybeAdd(draft.scenarios, CUSTOM_SCENARIO_NAME)
      draft.current = CUSTOM_SCENARIO_NAME
      draft.data.population = data
    }),
  )

  .withHandling(
    immerCase(setEpidemiologicalData, (draft, { data }) => {
      draft.scenarios = maybeAdd(draft.scenarios, CUSTOM_SCENARIO_NAME)
      draft.current = CUSTOM_SCENARIO_NAME
      draft.data.epidemiological = data
    }),
  )

  .withHandling(
    immerCase(setContainmentData, (draft, { data }) => {
      let validNumberPoints = draft.data.containment.numberPoints
      if (data.numberPoints && data.numberPoints >= 5 && data.numberPoints <= 100) {
        validNumberPoints = data.numberPoints
      }

      draft.scenarios = maybeAdd(draft.scenarios, CUSTOM_SCENARIO_NAME)
      draft.current = CUSTOM_SCENARIO_NAME
      draft.data.containment = {
        reduction: updateTimeSeries(draft.data.simulation.simulationTimeRange, data.reduction, validNumberPoints),
        numberPoints: validNumberPoints,
      }
    }),
  )

  .withHandling(
    immerCase(setSimulationData, (draft, { data }) => {
      draft.scenarios = maybeAdd(draft.scenarios, CUSTOM_SCENARIO_NAME)
      draft.current = CUSTOM_SCENARIO_NAME
      draft.data.simulation = data
      console.log('TIME', data.simulationTimeRange)
      draft.data.containment = {
        reduction: updateTimeSeries(
          data.simulationTimeRange,
          draft.data.containment.reduction,
          draft.data.containment.numberPoints,
        ),
        numberPoints: draft.data.containment.numberPoints,
      }
    }),
  )
