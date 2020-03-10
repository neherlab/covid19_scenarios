import containmentScenarios from '../../../assets/data/scenarios/containment'
import epidemiologicalScenarios from '../../../assets/data/scenarios/epidemiological' // prettier-ignore
import overallScenarios, { OverallScenario } from '../../../assets/data/scenarios/overall' // prettier-ignore
import populationScenarios from '../../../assets/data/scenarios/populations'
import simulationData from '../../../assets/data/scenarios/simulation'

import {
  EpidemiologicalData,
  PopulationData,
  SimulationData,
} from '../../../algorithms/Param.types'

export const overallScenarioNames = overallScenarios.map(s => s.name)
export const populationScenarioNames = populationScenarios.map(s => s.name)
export const epidemiologicalScenarioNames = epidemiologicalScenarios.map(s => s.name) // prettier-ignore
export const containmentScenarioNames = containmentScenarios.map(s => s.name)

export function getOverallScenario(scenario: string): OverallScenario {
  const overallScenario = overallScenarios.find(s => s.name === scenario)
  if (!overallScenario) {
    throw new Error(`Error: overall scenario "${scenario}" not found`)
  }
  return overallScenario
}

export function getPopulationData(scenario: string): PopulationData {
  const populationData = populationScenarios.find(s => s.name === scenario)?.data // prettier-ignore
  if (!populationData) {
    throw new Error(`Error: population scenario "${scenario}" not found`)
  }
  return populationData
}

export function getEpidemiologicalData(scenario: string): EpidemiologicalData {
  const epidemiologicalData = epidemiologicalScenarios.find(s => s.name === scenario)?.data // prettier-ignore
  if (!epidemiologicalData) {
    throw new Error(`Error: epidemiological scenario "${scenario}" not found`)
  }
  return epidemiologicalData
}

export function getContainmentScenarioData(scenario: string) {
  const containmentScenarioReduction = containmentScenarios.find(s => s.name === scenario)?.data // prettier-ignore
  if (!containmentScenarioReduction) {
    throw new Error(`Error: containment scenario "${scenario}" not found`)
  }
  return containmentScenarioReduction
}

export function getSimulationData(): SimulationData {
  return simulationData
}
