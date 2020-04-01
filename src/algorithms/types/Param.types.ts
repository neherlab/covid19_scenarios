import * as t from 'io-ts'
import { TimeSeriesType } from './TimeSeries.types'
import { DateType } from './Date.types'

export const PopulationDataType = t.type({
  populationServed: t.number,
  country: t.string,
  suspectedCasesToday: t.number,
  importsPerDay: t.number,
  hospitalBeds: t.number,
  ICUBeds: t.number,
  cases: t.string,
})

export type PopulationData = t.TypeOf<typeof PopulationDataType>

export const EpidemiologicalDataType = t.type({
  r0: t.number, // Average number of people who will catch a disease from one contagious person. Usually specified as a decimal, e. g. 2.7
  latencyTime: t.number,
  infectiousPeriod: t.number,
  lengthHospitalStay: t.number,
  lengthICUStay: t.number,
  seasonalForcing: t.number,
  peakMonth: t.number,
  overflowSeverity: t.number,
})

export type EpidemiologicalData = t.TypeOf<typeof EpidemiologicalDataType>

export const ContainmentDataType = t.type({
  reduction: TimeSeriesType,
  numberPoints: t.number,
})

export type ContainmentData = t.TypeOf<typeof ContainmentDataType>

export const DateRangeType = t.type({
  tMin: DateType,
  tMax: DateType,
})

export type DateRange = t.TypeOf<typeof DateRangeType>

export const SimulationDataType = t.type({
  simulationTimeRange: DateRangeType,
  numberStochasticRuns: t.number,
})

export type SimulationData = t.TypeOf<typeof SimulationDataType>

export const ScenarioDataType = t.type({
  population: PopulationDataType,
  epidemiological: EpidemiologicalDataType,
  containment: ContainmentDataType,
  simulation: SimulationDataType,
})

export type ScenarioData = t.TypeOf<typeof ScenarioDataType>

export type AllParamsFlat = PopulationData & EpidemiologicalData & SimulationData

interface EmpiricalDatum {
  time: Date
  cases: number
  deaths: number
  hospitalized: number
  ICU: number
}

export type EmpiricalData = EmpiricalDatum[]
