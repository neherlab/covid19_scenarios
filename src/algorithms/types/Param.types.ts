/* eslint-disable no-restricted-imports */

import type {
  ScenarioArray as ScenarioArrayMutable,
  ScenarioData as ScenarioDataMutable,
  ScenarioDatum as ScenarioDatumMutable,
  ScenarioDatumMitigation as ScenarioDatumMitigationMutable,
  MitigationInterval as MitigationIntervalMutable,
  ScenarioDatumEpidemiological,
  ScenarioDatumPopulation,
  ScenarioDatumSimulation,
} from '../../.generated/types'

import type { ScenarioDatum, MitigationInterval, ScenarioDatumMitigation } from './restricted/ScenarioDatum'

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
} from '../../.generated/types'

export type { DateRange, NumericRangeNonNegative, PercentageRange } from '../../.generated/types'

export { Convert, AgeGroup } from '../../.generated/types'

export type ScenarioArray = ScenarioArrayMutable
export type ScenarioData = ScenarioDataMutable

export type { ScenarioDatum, MitigationInterval, ScenarioDatumMitigation }
export type MitigationIntervalExternal = MitigationIntervalMutable
export type ScenarioDatumExternal = ScenarioDatumMutable
export type ScenarioDatumMitigationExternal = ScenarioDatumMitigationMutable

export type { ScenarioDatumEpidemiological, ScenarioDatumPopulation, ScenarioDatumSimulation }

export type ScenarioFlat = ScenarioDatumPopulation &
  ScenarioDatumEpidemiological &
  ScenarioDatumSimulation &
  ScenarioDatumMitigation
