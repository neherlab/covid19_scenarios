import {
  AllParams,
  CaseCounts,
  ContainmentData,
  DateRange,
  EmpiricalDatum,
  EpidemiologicalData,
  MitigationInterval,
  PopulationData,
  SimulationData,
  AgeDistribution,
  Severity,
  AgeGroup,
} from '../../.generated/types'

export {
  CaseCounts,
  AgeDistribution,
  DateRange,
  MitigationInterval,
  AllParams,
  EpidemiologicalData,
  PopulationData,
  SimulationData,
  ContainmentData,
  Severity,
  AgeGroup,
}

export type MitigationIntervalWithoutId = Omit<MitigationInterval, 'id'>

export type MitigationIntervals = MitigationInterval[]

export type AllParamsFlat = PopulationData & EpidemiologicalData & SimulationData & ContainmentData

export type EmpiricalData = EmpiricalDatum[]
