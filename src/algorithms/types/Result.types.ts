import { AgeDistribution } from '../../.generated/types'
import { TimeSeries } from './TimeSeries.types'

export interface InternalCurrentData {
  susceptible: number
  exposed: number[]
  infectious: number
  severe: number
  critical: number
  overflow: number
}

export interface InternalCumulativeData {
  recovered: number
  hospitalized: number
  critical: number
  fatality: number
}

export interface InternalState {
  current: InternalCurrentData
  cumulative: InternalCumulativeData
}

export interface ExposedCurrentData {
  susceptible: Map<string, number>
  exposed: Map<string, number>
  infectious: Map<string, number>
  severe: Map<string, number>
  critical: Map<string, number>
  overflow: Map<string, number>
}

export interface ExposedCumulativeData {
  recovered: Map<string, number>
  hospitalized: Map<string, number>
  critical: Map<string, number>
  fatality: Map<string, number>
}

// This defines the internal data structure
export interface SimulationTimePoint {
  time: number
  state: InternalState[]
}

// This defines the user-facing data structure
export interface ExportedTimePoint {
  time: number
  current: ExposedCurrentData
  cumulative: ExposedCumulativeData
}

export interface ModelFracs {
  severe: number
  critical: number
  fatal: number
  isolated: number
}

export interface ModelRates {
  latency: number
  imports: number
  infection: (t: number) => number
  recovery: number
  severe: number
  discharge: number
  critical: number
  stabilize: number
  fatality: number
  overflowFatality: number
}

export interface ModelParams {
  ageDistribution: AgeDistribution
  timeDelta: number
  timeDeltaDays: number
  populationServed: number
  numberStochasticRuns: number
  hospitalBeds: number
  ICUBeds: number
  fracs: ModelFracs[]
  rates: ModelRates[]
}

export interface UserResult {
  mean: ExportedTimePoint[]
  lower: ExportedTimePoint[]
  upper: ExportedTimePoint[]
  percentile: Record<number, ExportedTimePoint[]>
}

export interface TimeSeriesWithRange {
  mean: TimeSeries
  lower: TimeSeries
  upper: TimeSeries
}

export interface AlgorithmResult {
  trajectory: UserResult
  R0: TimeSeriesWithRange
}
