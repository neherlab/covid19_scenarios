import {
  AllParams,
  ContainmentData,
  DateRange,
  EmpiricalDatum,
  EpidemiologicalData,
  MitigationInterval,
  PopulationData,
  SimulationData,
} from '../../.generated/types/types'

export { DateRange, MitigationInterval, AllParams, EpidemiologicalData, SimulationData, ContainmentData }

export type CaseCounts = Record<string, EmpiricalData[]>

export type MitigationIntervalWithoutId = Omit<MitigationInterval, 'id'>

export type MitigationIntervals = MitigationInterval[]

// FIXME: One of these should go away
export type ScenarioData = AllParams

export type AllParamsFlat = PopulationData & EpidemiologicalData & SimulationData & ContainmentData

export type EmpiricalData = EmpiricalDatum[]
