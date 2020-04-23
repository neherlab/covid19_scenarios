import { AgeDistribution, EpidemiologicalData, PopulationData } from '../../../../../algorithms/types/Param.types'

export interface DateRangeDto {
  tMin?: number
  tMax?: number
}

export interface SimulationDataDto {
  simulationTimeRange: DateRangeDto
  numberStochasticRuns: number
}

export interface TimePointDto {
  t: number
  y: number
}

export type TimeSeriesDto = TimePointDto[]

export interface MitigationIntervalDto {
  id: string
  name: string
  color: string
  timeRange: DateRangeDto
  mitigationValue: number[]
}

// format of the application state persisted in the URL
export interface PersistedStateDto {
  current: string
  population: PopulationData
  epidemiological: EpidemiologicalData
  simulation: SimulationDataDto
  containment: MitigationIntervalDto[]
  ageDistribution: AgeDistribution
}
