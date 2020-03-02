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
  hospitalizedRate: number,
  recoveryRate: number, 
  dischargeRate: number, 
  deathRate: number, 
  avgInfectionRate: number, 
  timeDeltaDays: number, 
  timeDelta: number,
  populationServed: number
};

export interface AlgorithmResult {
    trajectory: SimulationTimePoint[],
    params: ModelParams,
}
