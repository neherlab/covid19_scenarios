export interface InternalCurrentData {
  susceptible: Record<string, number>
  exposed: Record<string, number[]>
  infectious: Record<string, number>
  severe: Record<string, number>
  critical: Record<string, number>
  overflow: Record<string, number>
}

export interface ExposedCurrentData {
  susceptible: Record<string, number>
  exposed: Record<string, number>
  infectious: Record<string, number>
  severe: Record<string, number>
  critical: Record<string, number>
  overflow: Record<string, number>
}

export interface CumulativeData {
  recovered: Record<string, number>
  hospitalized: Record<string, number>
  critical: Record<string, number>
  fatality: Record<string, number>
}

// This defines the internal data structure
export interface SimulationTimePoint {
  time: number
  current: InternalCurrentData
  cumulative: CumulativeData
}

// This defines the user-facing data structure
export interface ExportedTimePoint {
  time: number
  current: ExposedCurrentData
  cumulative: CumulativeData
}

export interface ModelFracs {
  severe: Record<string, number>
  critical: Record<string, number>
  fatal: Record<string, number>
  isolated: Record<string, number>
}

export interface ModelRates {
  latency: number
  infection: (t: Date) => number
  recovery: Record<string, number>
  severe: Record<string, number>
  discharge: Record<string, number>
  critical: Record<string, number>
  stabilize: Record<string, number>
  fatality: Record<string, number>
  overflowFatality: Record<string, number>
}

export interface ModelParams {
  ageDistribution: Record<string, number>
  importsPerDay: Record<string, number>
  timeDelta: number
  timeDeltaDays: number
  populationServed: number
  numberStochasticRuns: number
  hospitalBeds: number
  ICUBeds: number
  frac: ModelFracs
  rate: ModelRates
}

export interface UserResult {
  trajectory: ExportedTimePoint[]
}

export interface AlgorithmResult {
  deterministic: UserResult
  stochastic: UserResult[]
  params: ModelParams
}
