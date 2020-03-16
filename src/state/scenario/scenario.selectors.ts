import { State } from '../reducer'

import {
  AllParams,
  ContainmentData,
  EmpiricalData,
  EpidemiologicalData,
  PopulationData,
  SeverityData,
  SimulationData,
} from '../../algorithms/Param.types'

import countryAgeDistribution from '../../assets/data/country_age_distribution.json'

export function selectScenariosOverall(state: State) {
  return state.scenario.overall.scenarios
}

export function selectScenariosPopulation(state: State) {
  return state.scenario.population.scenarios
}

export function selectScenariosEpidemiological(state: State) {
  return state.scenario.epidemiological.scenarios
}

export function selectScenariosContainment(state: State) {
  return state.scenario.containment.scenarios
}

export function selectCurrentScenarioOverall(state: State) {
  return state.scenario.overall.current
}

export function selectCurrentScenarioPopulation(state: State) {
  return state.scenario.population.current
}

export function selectCurrentScenarioEpidemiological(state: State) {
  return state.scenario.epidemiological.current
}

export function selectCurrentScenarioContainment(state: State) {
  return state.scenario.containment.current
}

export function selectDataPopulation(state: State): PopulationData {
  return state.scenario.population.data
}

export function selectDataEpidemiological(state: State): EpidemiologicalData {
  return state.scenario.epidemiological.data
}

export function selectDataContainment(state: State): ContainmentData {
  return state.scenario.containment.data
}

export function selectDataSimulation(state: State): SimulationData {
  return state.scenario.simulation.data
}

export function selectDataSeverity(state: State): SeverityData {
  return state.scenario.severity.data
}

export function selectEmpiricalCaseCounts(state: State): EmpiricalData {
  const country = selectCountry(state)
  const cases = state.scenario.empiricalCaseCounts.data
  console.log({ cases })
  return cases[country]
}

export function selectAllScenarioData(state: State): AllParams {
  const population = selectDataPopulation(state)
  const epidemiological = selectDataEpidemiological(state)
  const containment = selectDataContainment(state)
  const severity = selectDataSeverity(state)
  const simulation = selectDataSimulation(state)
  return {
    population,
    epidemiological,
    containment,
    severity,
    simulation,
  }
}

export function selectAllDataFlat(state: State) {
  const { population, epidemiological, containment, severity, simulation } = selectAllScenarioData(state)
  return {
    ...population,
    ...epidemiological,
    ...containment,
    ...severity,
    ...simulation,
  }
}

export function selectCountry(state: State) {
  const population = selectDataPopulation(state)
  return population.country
}

export function selectAgeDistribution(state: State) {
  const country = selectCountry(state)
  // TODO: validate and error-check this
  return countryAgeDistribution[country]
}

export function selectReduction(state: State) {
  const population = selectDataContainment(state)
  return population.reduction
}
