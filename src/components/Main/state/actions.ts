import actionCreatorFactory from 'typescript-fsa'

import { ScenarioData, ContainmentData } from '../../../algorithms/types/Param.types'

const action = actionCreatorFactory('SCENARIO')

export interface SetScenarioParams {
  name: string
}

export const setScenario = action<SetScenarioParams>('SET_SCENARIO')

export interface SetScenarioDataParams {
  data: ScenarioData
}

export interface SetContainmentDataParams {
  data: ContainmentData
}

export const setScenarioData = action<SetScenarioDataParams>('SET_SCENARIO_DATA')
export const setContainmentData = action<SetContainmentDataParams>('SET_CONTAINMENT_DATA')
