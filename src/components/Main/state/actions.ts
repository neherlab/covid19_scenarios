import actionCreatorFactory from 'typescript-fsa'

import {
  ScenarioData,
  ContainmentData,
  EpidemiologicalData,
  SimulationData,
  PopulationData,
} from '../../../algorithms/types/Param.types'

const action = actionCreatorFactory('SCENARIO')

export interface SetScenarioParams {
  id: string
  name: string
}

export const setScenario = action<SetScenarioParams>('SET_SCENARIO')

export interface SetScenarioDataParams {
  id: string
  data: ScenarioData
}

export interface SetPopulationDataParams {
  id: string
  data: PopulationData
}

export interface SetEpidemiologicalDataParams {
  id: string
  data: EpidemiologicalData
}

export interface SetContainmentDataParams {
  id: string
  data: ContainmentData
}

export interface SetSimulationDataParams {
  id: string
  data: SimulationData
}

export const setScenarioData = action<SetScenarioDataParams>('SET_SCENARIO_DATA')
export const setPopulationData = action<SetPopulationDataParams>('SET_POPULATION_DATA')
export const setEpidemiologicalData = action<SetEpidemiologicalDataParams>('SET_EPIDEMIOLOGICAL_DATA')
export const setContainmentData = action<SetContainmentDataParams>('SET_CONTAINMENT_DATA')
export const setSimulationData = action<SetSimulationDataParams>('SET_SIMULATION_DATA')
