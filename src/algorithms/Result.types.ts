export interface SimulationTimePoint {
  time: number,
  susceptible: number,
  exposed: number,
  infectious: number,
  hospitalized: number,
  dead: number
};

export type AlgorithmResult = SimulationTimePoint[];
