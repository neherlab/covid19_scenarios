import actionCreatorFactory from 'typescript-fsa'

import {
  AgeDistributionDatum,
  ScenarioDatumEpidemiological,
  ScenarioDatumMitigation,
  ScenarioDatumPopulation,
  ScenarioDatumSimulation,
} from '../../../algorithms/types/Param.types'

const action = actionCreatorFactory('SCENARIO')

export interface SetScenarioParams {
  name: string
}

export const setScenario = action<SetScenarioParams>('SET_SCENARIO')

export interface SetPopulationData {
  data: ScenarioDatumPopulation
}

export interface SetEpidemiologicalData {
  data: ScenarioDatumEpidemiological
}

export interface SetMitigationData {
  data: ScenarioDatumMitigation
}

export interface SetSimulationData {
  data: ScenarioDatumSimulation
}

export interface SetAgeDistributionData {
  data: AgeDistributionDatum[]
}

export const setPopulationData = action<SetPopulationData>('SET_POPULATION_DATA')
export const setEpidemiologicalData = action<SetEpidemiologicalData>('SET_EPIDEMIOLOGICAL_DATA')
export const setContainmentData = action<SetMitigationData>('SET_MITIGATION_DATA')
export const setSimulationData = action<SetSimulationData>('SET_SIMULATION_DATA')
export const setAgeDistributionData = action<SetAgeDistributionData>('SET_AGE_DISTRIBUTION_DATA')
