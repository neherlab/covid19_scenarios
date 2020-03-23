import {
  containmentScenarioNames,
  epidemiologicalScenarioNames,
  getContainmentScenarioData,
  getEpidemiologicalData,
  getOverallScenario,
  getPopulationData,
  getSimulationData,
  overallScenarioNames,
  populationScenarioNames,
} from './data'

import { ContainmentData, EpidemiologicalData, PopulationData, SimulationData } from '../../../algorithms/types/Param.types'

import i18next from 'i18next'

export interface State {
  overall: {
    scenarios: string[]
    current: string
  }
  population: {
    scenarios: string[]
    current: string
    data: PopulationData
  }
  epidemiological: {
    scenarios: string[]
    current: string
    data: EpidemiologicalData
  }
  containment: {
    scenarios: string[]
    current: string
    data: ContainmentData
  }
  simulation: {
    data: SimulationData
  }
}

export const DEFAULT_OVERALL_SCENARIO_NAME = i18next.t('Default')
export const CUSTOM_SCENARIO_NAME = i18next.t('Custom')

export const defaultOverallScenarioName = DEFAULT_OVERALL_SCENARIO_NAME
export const defaultScenario = getOverallScenario(defaultOverallScenarioName)

export const defaultScenarioState: State = {
  overall: {
    scenarios: overallScenarioNames,
    current: defaultOverallScenarioName,
  },
  population: {
    scenarios: populationScenarioNames,
    current: defaultScenario.populationScenario,
    data: getPopulationData(defaultScenario.populationScenario),
  },
  epidemiological: {
    scenarios: epidemiologicalScenarioNames,
    current: defaultScenario.epidemiologicalScenario,
    data: getEpidemiologicalData(defaultScenario.epidemiologicalScenario),
  },
  containment: {
    scenarios: containmentScenarioNames,
    current: defaultScenario.containmentScenario,
    data: getContainmentScenarioData(defaultScenario.containmentScenario),
  },
  simulation: {
    data: getSimulationData(defaultScenario.populationScenario),
  },
}
