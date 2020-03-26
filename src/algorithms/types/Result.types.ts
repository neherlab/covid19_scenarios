// This defines the internal data structure
export interface SimulationTimePoint {
  time: number
  // Instantaneous categories
  susceptible: Record<string, number>
  exposed: Record<string, number[]>
  infectious: Record<string, number>
  hospitalized: Record<string, number>
  critical: Record<string, number>
  overflow: Record<string, number>
  // Cumulative categories
  recovered: Record<string, number>
  discharged: Record<string, number>
  intensive: Record<string, number>
  dead: Record<string, number>
}

// This defines the user-facing data structure
export interface ExportedTimePoint {
  time: number
  // Instantaneous categories
  susceptible: Record<string, number>
  exposed: Record<string, number>
  infectious: Record<string, number>
  hospitalized: Record<string, number>
  critical: Record<string, number>
  overflow: Record<string, number>
  // Cumulative categories
  recovered: Record<string, number>
  discharged: Record<string, number>
  intensive: Record<string, number>
  dead: Record<string, number>
}

export interface ModelParams {
  ageDistribution: Record<string, number>
  infectionSeverityRatio: Record<string, number>
  infectionFatality: Record<string, number>
  infectionCritical: Record<string, number>
  hospitalizedRate: Record<string, number>
  recoveryRate: Record<string, number>
  dischargeRate: Record<string, number>
  stabilizationRate: Record<string, number>
  criticalRate: Record<string, number>
  deathRate: Record<string, number>
  overflowDeathRate: Record<string, number>
  isolatedFrac: Record<string, number>
  importsPerDay: Record<string, number>
  timeDeltaDays: number
  latencyTime: number
  infectionRate: (t: Date) => number
  timeDelta: number
  populationServed: number
  numberStochasticRuns: number
  hospitalBeds: number
  ICUBeds: number
}

export interface UserResult {
  trajectory: ExportedTimePoint[]
}

export interface AlgorithmResult {
  deterministic: UserResult
  stochastic: UserResult[]
  params: ModelParams
}
