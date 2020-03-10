import actionCreatorFactory from 'typescript-fsa'

import {
  ContainmentData,
  EpidemiologicalData,
  PopulationData,
} from '../../../algorithms/Param.types'

const action = actionCreatorFactory('SCENARIO')

export interface SetScenarioParams {
  scenarioName: string
}

export const setOverallScenario = action<SetScenarioParams>('SET_OVERALL_SCENARIO') // prettier-ignore
export const setPopulationScenario = action<SetScenarioParams>('SET_POPULATION_SCENARIO') // prettier-ignore
export const setEpidemiologicalScenario = action<SetScenarioParams>('SET_EPIDEMIOLOGICAL_SCENARIO') // prettier-ignore
export const setContainmentScenario = action<SetScenarioParams>('SET_CONTAINMENT_SCENARIO') // prettier-ignore

export interface SetPopulationDataParams {
  data: PopulationData
}
export interface SetEpidemiologicalDataParams {
  data: EpidemiologicalData
}
export interface SetContainmeDatantData {
  data: ContainmentData
}

export const setPopulationData = action<SetPopulationDataParams>('SET_POPULATION_DATA') // prettier-ignore
export const setEpidemiologicalData = action<SetEpidemiologicalDataParams>('SET_EPIDEMIOLOGICAL_DATA') // prettier-ignore
export const setContainmentData = action<SetContainmeDatantData>('SET_CONTAINMENT_DATA') // prettier-ignore
