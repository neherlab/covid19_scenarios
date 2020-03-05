export interface SimulationTimePoint {
  time: number,
  susceptible: number,
  exposed: number,
  infectious: number,
  hospitalized: number,
  recovered: number,
  discharged: number,
  critical: number,
  dead: number
};

export interface ModelParams {
  ageDistribution: Record<string, number>,
  infectionSeverityRatio: Record<string, number>,
  infectionFatality: Record<string, number>,
  infectionCritical: Record<string, number>,
  hospitalizedRate: number,
  recoveryRate: number,
  dischargeRate: number,
  stabilizationRate: number,
  criticalRate: number,
  deathRate: number,
  avgInfectionRate: number,
  timeDeltaDays: number,
  timeDelta: number,
  populationServed: number,
  numberStochasticRuns: number,
};

export interface AlgorithmResult {
    deterministicTrajectory: SimulationTimePoint[],
    stochasticTrajectories: SimulationTimePoint[][],
    params: ModelParams,
}
