import actionCreatorFactory from 'typescript-fsa'

import {
  ContainmentData,
  EpidemiologicalData,
  SimulationData,
  PopulationData,
  AgeDistribution,
} from '../../../algorithms/types/Param.types'

const action = actionCreatorFactory('SCENARIO')

export interface SetScenarioParams {
  name: string
}

export const setScenario = action<SetScenarioParams>('SET_SCENARIO')

export interface SetPopulationDataParams {
  data: PopulationData
}

export interface SetEpidemiologicalDataParams {
  data: EpidemiologicalData
}

export interface SetContainmentDataParams {
  data: ContainmentData
}

export interface SetSimulationDataParams {
  data: SimulationData
}

export interface SetAgeDistributionDataParams {
  data: AgeDistribution
}

export const setPopulationData = action<SetPopulationDataParams>('SET_POPULATION_DATA')
export const setEpidemiologicalData = action<SetEpidemiologicalDataParams>('SET_EPIDEMIOLOGICAL_DATA')
export const setContainmentData = action<SetContainmentDataParams>('SET_CONTAINMENT_DATA')
export const setSimulationData = action<SetSimulationDataParams>('SET_SIMULATION_DATA')
export const setAgeDistributionData = action<SetAgeDistributionDataParams>('SET_AGE_DISTRIBUTION_DATA')
