import { AllParams } from '../../../../algorithms/types/Param.types'
import { serialize } from '../serialization/StateSerializer'
import { State, defaultScenarioState } from '../state'

export const updateURL = (allParams: AllParams) => {
  const scenarioState: State = {
    ...defaultScenarioState,
    data: {
      ...allParams,
    },
  }
  const queryString = serialize(scenarioState)

  window.history.pushState('', '', `?${queryString}`)
}
