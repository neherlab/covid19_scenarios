import { noop } from 'lodash'

import createCachedSelector from 're-reselect'

import type { RunParams } from '../../algorithms/run'
import type {
  AgeDistributionDatum,
  ScenarioDatum,
  SeverityDistributionDatum,
  ScenarioParameters,
} from '../../algorithms/types/Param.types'
import type { State } from '../reducer'

export const selectRunParams = createCachedSelector((state: State): RunParams => {
  const { scenarioData, ageDistributionData, severityDistributionData } = state.scenario

  const params = {
    ...scenarioData.data.population,
    ...scenarioData.data.epidemiological,
    ...scenarioData.data.simulation,
    ...scenarioData.data.mitigation,
  }

  return { params, ageDistribution: ageDistributionData.data, severity: severityDistributionData.data }
}, noop)

export const selectScenarioNames = (state: State): string[] => state.scenario.defaultScenariosNames

export const selectCurrentScenarioName = (state: State): string => state.scenario.scenarioData.name

export const selectScenarioData = (state: State): ScenarioDatum => state.scenario.scenarioData.data

export const selectAgeDistributionData = (state: State): AgeDistributionDatum[] =>
  state.scenario.ageDistributionData.data

export const selectSeverityDistributionData = (state: State): SeverityDistributionDatum[] =>
  state.scenario.severityDistributionData.data

export const selectScenarioParameters = ({
  scenario: { scenarioData, severityDistributionData, ageDistributionData },
}: State): ScenarioParameters => ({
  scenarioData,
  severityDistributionData,
  ageDistributionData,
})

export const selectCanRun = (state: State): boolean => state.scenario.canRun
