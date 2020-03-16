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
  getSeverityData,
} from './scenario.data'

import {
  ContainmentData,
  EpidemiologicalData,
  PopulationData,
  SeverityData,
  SimulationData,
} from '../../algorithms/Param.types'

export interface ScenarioState {
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
  severity: {
    data: SeverityData
  }
  simulation: {
    data: SimulationData
  }
}

export const DEFAULT_OVERALL_SCENARIO_NAME = 'Default'
export const CUSTOM_SCENARIO_NAME = 'Custom'

export const defaultOverallScenarioName = DEFAULT_OVERALL_SCENARIO_NAME
export const defaultScenario = getOverallScenario(defaultOverallScenarioName)

export const defaultScenarioState: ScenarioState = {
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
  severity: {
    data: getSeverityData(),
  },
  simulation: {
    data: getSimulationData(),
  },
}
