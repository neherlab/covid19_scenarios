export interface PopulationParams {
  populationServed: number
  country: string
  suspectedCasesToday: number
  importsPerDay: number
}

export interface EpidemiologicalParams {
  r0: number
  incubationTime: number
  infectiousPeriod: number
  lengthHospitalStay: number
  seasonalForcing: number
  peakMonth: number
}

export interface SimulationParams {
  tMin: Date
  tMax: Date
  numberStochasticRuns: number
}

export type AllParams = PopulationParams &
  SimulationParams &
  EpidemiologicalParams
