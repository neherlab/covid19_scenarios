/* eslint-disable no-restricted-imports */

import type {
  ScenarioArray,
  ScenarioData as ScenarioDataExternal,
  ScenarioDatum as ScenarioDatumExternal,
  ScenarioDatumMitigation as ScenarioDatumMitigationExternal,
  MitigationInterval as MitigationIntervalExternal,
  MitigationAgeSpecificDatum as MitigationAgeSpecificDatumExternal,
  ScenarioDatumEpidemiological,
  ScenarioDatumPopulation,
  ScenarioDatumSimulation,
  AgeDistributionData,
  SeverityDistributionData,
} from '../../.generated/latest/types'

import type {
  ScenarioData,
  ScenarioDatum,
  MitigationInterval,
  ScenarioDatumMitigation,
  MitigationAgeSpecificDatum,
} from './restricted/ScenarioDatum'

export type {
  AgeDistributionArray,
  AgeDistributionData,
  AgeDistributionDatum,
  CaseCountsArray,
  CaseCountsData,
  CaseCountsDatum,
  SeverityDistributionArray,
  SeverityDistributionData,
  SeverityDistributionDatum,
  Shareable,
} from '../../.generated/latest/types'

export type { DateRange, NumericRangeNonNegative, PercentageRange } from '../../.generated/latest/types'

export { Convert, AgeGroup } from '../../.generated/latest/types'

export type { ScenarioData, ScenarioDatum, MitigationInterval, ScenarioDatumMitigation, MitigationAgeSpecificDatum }

export type { ScenarioDatumEpidemiological, ScenarioDatumPopulation, ScenarioDatumSimulation }

export type {
  ScenarioArray,
  ScenarioDataExternal,
  ScenarioDatumExternal,
  ScenarioDatumMitigationExternal,
  MitigationIntervalExternal,
  MitigationAgeSpecificDatumExternal,
}

export interface ScenarioParameters {
  scenarioData: ScenarioData
  ageDistributionData: AgeDistributionData
  severityDistributionData: SeverityDistributionData
}

export type ScenarioFlat = ScenarioDatumPopulation &
  ScenarioDatumEpidemiological &
  ScenarioDatumSimulation &
  ScenarioDatumMitigation
