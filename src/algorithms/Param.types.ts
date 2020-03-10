export interface PopulationData {
  populationServed: number
  country: string
  suspectedCasesToday: number
  importsPerDay: number
}

export interface EpidemiologicalData {
  r0: number
  incubationTime: number
  infectiousPeriod: number
  lengthHospitalStay: number
  seasonalForcing: number
  peakMonth: number
}

export interface ContainmentData {
  reduction: number[]
}

// TODO: rename to SimulationData for consistency
export interface SimulationData {
  tMin: Date
  tMax: Date
  numberStochasticRuns: number
}

export interface AllParams {
  population: PopulationData
  epidemiological: EpidemiologicalData
  simulation: SimulationData
}
