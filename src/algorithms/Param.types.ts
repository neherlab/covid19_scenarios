export interface PopulationData {
  populationServed: number
  country: string
  suspectedCasesToday: number
  importsPerDay: number
  hospitalBeds: number
  ICUBeds: number
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

interface TimePoint {
  t: Date
  y: number
}

export type TimeSeries = TimePoint[]

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

export interface SeverityTableRow {
  id: number
  ageGroup: string
  confirmed: number
  severe: number
  critical: number
  fatal: number
  totalFatal?: number
  isolated?: number
  errors?: {
    confirmed?: string
    severe?: string
    critical?: string
    fatal?: string
    isolated?: string
  }
}

export type SeverityTableData = SeverityTableRow[]

export interface SeverityData {
  severityTable: SeverityTableData
}

export interface AllParams {
  population: PopulationData
  epidemiological: EpidemiologicalData
  containment: ContainmentData
  severity: SeverityData
  simulation: SimulationData
}

export type AllParamsFlat = PopulationData & EpidemiologicalData & ContainmentData & SeverityData & SimulationData

interface EmpiricalDatum {
  time: Date
  cases: number
  deaths: number
}

export type EmpiricalData = EmpiricalDatum[]
