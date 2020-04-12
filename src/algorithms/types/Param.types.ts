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
}

export type MitigationIntervalWithoutId = Omit<MitigationInterval, 'id'>

export type MitigationIntervals = MitigationInterval[]

// FIXME: One of these should go away
export type ScenarioData = AllParams

export type AllParamsFlat = PopulationData & EpidemiologicalData & SimulationData & ContainmentData

export type EmpiricalData = EmpiricalDatum[]
