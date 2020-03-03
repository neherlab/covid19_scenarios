export interface SimulationTimePoint {
  time: number,
  susceptible: number,
  exposed: number,
  infectious: number,
  hospitalized: number,
  recovered: number,
  discharged: number,
  dead: number
};

export interface ModelParams {
  ageDistribution: Record<string, number>,
  infectionSeverityRatio: Record<string, number>,
  infectionFatality: Record<string, number>,
  hospitalizedRate: number,
  recoveryRate: number, 
  dischargeRate: number, 
  deathRate: number, 
  avgInfectionRate: number, 
  timeDeltaDays: number, 
  timeDelta: number,
  populationServed: number,
};

export interface AlgorithmResult {
    deterministicTrajectory: SimulationTimePoint[],
    stochasticTrajectories: SimulationTimePoint[][],
    params: ModelParams,
}
