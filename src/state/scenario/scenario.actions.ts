import { StrictOmit } from 'ts-essentials'
import actionCreatorFactory from 'typescript-fsa'

import type {
  AgeDistributionDatum,
  ScenarioDatumEpidemiological,
  ScenarioDatumMitigation,
  ScenarioDatumPopulation,
  ScenarioDatumSimulation,
  SeverityDistributionDatum,
} from '../../algorithms/types/Param.types'

import type { ScenarioState } from './scenario.state'

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

export interface SetSeverityDistributionData {
  data: SeverityDistributionDatum[]
}

export const setPopulationData = action<SetPopulationData>('SET_POPULATION_DATA')
export const setEpidemiologicalData = action<SetEpidemiologicalData>('SET_EPIDEMIOLOGICAL_DATA')
export const setMitigationData = action<SetMitigationData>('SET_MITIGATION_DATA')
export const setSimulationData = action<SetSimulationData>('SET_SIMULATION_DATA')
export const setAgeDistributionData = action<SetAgeDistributionData>('SET_AGE_DISTRIBUTION_DATA')
export const setSeverityDistributionData = action<SetSeverityDistributionData>('SET_SEVERITY_DISTRIBUTION_DATA')

export type SetScenarioStateData = StrictOmit<ScenarioState, 'defaultScenariosNames'>
export const setScenarioState = action<SetScenarioStateData>('SET_STATE_DATA')
