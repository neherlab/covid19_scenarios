import { StrictOmit } from 'ts-essentials'
import actionCreatorFactory from 'typescript-fsa'

import type {
  AgeDistributionDatum,
  ScenarioDatumEpidemiological,
  ScenarioDatumMitigation,
  ScenarioDatumPopulation,
  ScenarioDatumSimulation,
} from '../../../algorithms/types/Param.types'

import type { State } from './state'

const action = actionCreatorFactory('SCENARIO')

export interface SetScenarioParams {
  name: string
}

export const renameCurrentScenario = action<SetScenarioParams>('RENAME_CURRENT_SCENARIO')
export const setScenario = action<SetScenarioParams>('SET_SCENARIO_DATA')

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

export type SetStateData = StrictOmit<State, 'scenarios'>

export const setPopulationData = action<SetPopulationData>('SET_POPULATION_DATA')
export const setEpidemiologicalData = action<SetEpidemiologicalData>('SET_EPIDEMIOLOGICAL_DATA')
export const setMitigationData = action<SetMitigationData>('SET_MITIGATION_DATA')
export const setSimulationData = action<SetSimulationData>('SET_SIMULATION_DATA')
export const setAgeDistributionData = action<SetAgeDistributionData>('SET_AGE_DISTRIBUTION_DATA')
export const setStateData = action<SetStateData>('SET_STATE_DATA')
