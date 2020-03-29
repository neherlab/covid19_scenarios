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
    immerCase(setScenario, (draft, { id, name }) => {
      draft[id].scenarios = maybeAdd(draft[id].scenarios, CUSTOM_SCENARIO_NAME)
      draft[id].current = name
      if (name !== CUSTOM_SCENARIO_NAME) {
        draft[id].data = getScenarioData(name)
        draft[id].data.containment = {
          reduction: updateTimeSeries(
            draft[id].data.simulation.simulationTimeRange,
            draft[id].data.containment.reduction,
            draft[id].data.containment.numberPoints,
          ),
          numberPoints: draft[id].data.containment.numberPoints,
        }
      }
    }),
  )

  .withHandling(
    immerCase(setScenarioData, (draft, { id, data }) => {
      draft[id].scenarios = maybeAdd(draft[id].scenarios, CUSTOM_SCENARIO_NAME)
      draft[id].current = CUSTOM_SCENARIO_NAME
      draft[id].data = {
        population: data.population,
        epidemiological: data.epidemiological,
        containment: data.containment,
        simulation: data.simulation,
      }
    }),
  )

  .withHandling(
    immerCase(setPopulationData, (draft, { id, data }) => {
      draft[id].scenarios = maybeAdd(draft[id].scenarios, CUSTOM_SCENARIO_NAME)
      draft[id].current = CUSTOM_SCENARIO_NAME
      draft[id].data.population = data
    }),
  )

  .withHandling(
    immerCase(setEpidemiologicalData, (draft, { id, data }) => {
      draft[id].scenarios = maybeAdd(draft[id].scenarios, CUSTOM_SCENARIO_NAME)
      draft[id].current = CUSTOM_SCENARIO_NAME
      draft[id].data.epidemiological = data
    }),
  )

  .withHandling(
<<<<<<< HEAD
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
=======
    immerCase(setContainmentData, (draft, { id, data }) => {
      draft[id].scenarios = maybeAdd(draft[id].scenarios, CUSTOM_SCENARIO_NAME)
      draft[id].current = CUSTOM_SCENARIO_NAME
      draft[id].data.containment = {
        reduction: updateTimeSeries(draft[id].data.simulation.simulationTimeRange, data.reduction, data.numberPoints),
        numberPoints: data.numberPoints,
>>>>>>> segment scenario state by scenario id to support many
      }
    }),
  )

  .withHandling(
    immerCase(setSimulationData, (draft, { id, data }) => {
      draft[id].scenarios = maybeAdd(draft[id].scenarios, CUSTOM_SCENARIO_NAME)
      draft[id].current = CUSTOM_SCENARIO_NAME
      draft[id].data.simulation = data
      draft[id].data.containment = {
        reduction: updateTimeSeries(
          data.simulationTimeRange,
          draft[id].data.containment.reduction,
          draft[id].data.containment.numberPoints,
        ),
        numberPoints: draft[id].data.containment.numberPoints,
      }
    }),
  )
