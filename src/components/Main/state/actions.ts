import actionCreatorFactory from 'typescript-fsa'

import { ScenarioData } from '../../../algorithms/types/Param.types'

const action = actionCreatorFactory('SCENARIO')

export interface SetScenarioParams {
  scenarioName: string
}

export const setScenario = action<SetScenarioParams>('SET_SCENARIO')

export interface SetScenarioDataParams {
  data: ScenarioData
}

export const setData = action<SetScenarioDataParams>('SET_SCENARIO_DATA')
