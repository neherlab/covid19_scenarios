import type { RunParams } from '../../algorithms/run'
import type {
  AgeDistributionDatum,
  MitigationInterval,
  ScenarioDatum,
  SeverityDistributionDatum,
  ScenarioParameters,
} from '../../algorithms/types/Param.types'

import { verifyPositive } from '../../algorithms/preparePlotData'

import type { State } from '../reducer'

export const selectRunParams = (state: State): RunParams => {
  const { scenarioData, ageDistributionData, severityDistributionData } = state.scenario

  const params = {
    ...scenarioData.data.population,
    ...scenarioData.data.epidemiological,
    ...scenarioData.data.simulation,
    ...scenarioData.data.mitigation,
  }

  return { params, ageDistribution: ageDistributionData.data, severity: severityDistributionData.data }
}

export const selectScenarioNames = (state: State): string[] => state.scenario.defaultScenariosNames

export const selectCurrentScenarioName = (state: State): string => state.scenario.scenarioData.name

export const selectScenarioData = (state: State): ScenarioDatum => state.scenario.scenarioData.data

export const selectAgeDistributionData = (state: State): AgeDistributionDatum[] =>
  state.scenario.ageDistributionData.data

export const selectSeverityDistributionData = (state: State): SeverityDistributionDatum[] =>
  state.scenario.severityDistributionData.data

export const selectCaseCountsData = (state: State) => state.scenario.caseCountsData?.data

export const selectCaseCountsNameCustom = (state: State) => state.scenario.caseCountsNameCustom

export const selectScenarioParameters = ({
  scenario: { scenarioData, severityDistributionData, ageDistributionData },
}: State): ScenarioParameters => ({
  scenarioData,
  severityDistributionData,
  ageDistributionData,
})

export const selectMitigationIntervals = (state: State): MitigationInterval[] =>
  state.scenario.scenarioData.data.mitigation.mitigationIntervals

export const selectHospitalBeds = (state: State): number | undefined =>
  verifyPositive(state.scenario.scenarioData.data.population.hospitalBeds)

export const selectIcuBeds = (state: State): number | undefined =>
  verifyPositive(state.scenario.scenarioData.data.population.icuBeds)

export const selectCanRun = (state: State): boolean => state.scenario.canRun && !state.algorithm.isRunning
