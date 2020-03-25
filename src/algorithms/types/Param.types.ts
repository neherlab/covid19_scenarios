import { TimeSeries } from './TimeSeries.types'

export interface PopulationData {
  populationServed: number
  country: string
  suspectedCasesToday: number
  importsPerDay: number
  hospitalBeds: number
  ICUBeds: number
  cases: string
}

export interface EpidemiologicalData {
  r0: number // Average number of people who will catch a disease from one contagious person. Usually specified as a decimal, e. g. 2.7
  incubationTime: number
  infectiousPeriod: number
  lengthHospitalStay: number
  lengthICUStay: number
  seasonalForcing: number
  peakMonth: number
  overflowSeverity: number
}

export interface ContainmentData {
  reduction: TimeSeries
  numberPoints: number
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
  containment: ContainmentData
}

export type AllParamsFlat = PopulationData & EpidemiologicalData & SimulationData

interface EmpiricalDatum {
  time: Date
  cases: number
  deaths: number
  hospitalized: number
  ICU: number
}

export type EmpiricalData = EmpiricalDatum[]
