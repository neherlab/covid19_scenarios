export interface SimulationTimePoint {
  time: number,
  susceptible: number,
  exposed: number,
  infectious: number,
  severe: number,
  discharged: number,
  dead: number
};

export interface ModelParams {
  ageDistribution: Record<string, number>,
  severeRate: number,
  recoveryRate: number, 
  dischargeRate: number, 
  deathRate: number, 
  avgInfectionRate: number, 
  timeDeltaDays: number, 
  timeDelta: number
};

export interface AlgorithmResult {
    trajectory: SimulationTimePoint[],
    params: ModelParams,
}
