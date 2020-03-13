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
  lengthICUStay: number
  seasonalForcing: number
  peakMonth: number
}

export interface ContainmentData {
  reduction: number[]
}

export interface DateRange {
  tMin: Date
  tMax: Date
}

export interface SimulationData {
  simulationTimeRange: DateRange
  numberStochasticRuns: number
}

export interface AllParams {
  population: PopulationData
  epidemiological: EpidemiologicalData
  simulation: SimulationData
}

export type AllParamsFlat = PopulationData & EpidemiologicalData & SimulationData
