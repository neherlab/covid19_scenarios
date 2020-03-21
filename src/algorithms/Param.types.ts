import { TimeSeries } from './TimeSeries'

export interface PopulationData {
  populationServed: number
  country: string
  suspectedCasesToday: number
  importsPerDay: number
  hospitalBeds: number
  ICUBeds: number,
  cases: string
}

export interface EpidemiologicalData {
  r0: number
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

interface EmpiricalDatum {
    time: Date
    cases: number
    deaths: number
    hospitalized: number
    ICU: number
}

export type EmpiricalData = EmpiricalDatum[]

