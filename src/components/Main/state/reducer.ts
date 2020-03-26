import _ from 'lodash'

import { reducerWithInitialState } from 'typescript-fsa-reducers'

import immerCase from '../../../state/util/fsaImmerReducer'

import { setScenarioData, setScenario } from './actions'

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
    immerCase(setScenario, (draft, { scenarioName }) => {
      draft.scenarios = maybeAdd(draft.scenarios, CUSTOM_SCENARIO_NAME)
      draft.current = scenarioName
      if (scenarioName !== CUSTOM_SCENARIO_NAME) {
        draft.data = getScenarioData(scenarioName)
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
