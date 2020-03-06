export interface Param<ValueType> {
  name: string
  defaultValue: ValueType
}

export interface MainParams {
  populationServed: Param<number>
  ageDistribution: Param<string>
  suspectedCasesToday: Param<number>
  importsPerDay: Param<number>
  tMin: Param<Date>
  tMax: Param<Date>
}

export interface AdditionalParams {
  r0: Param<number>
  incubationTime: Param<number>
  infectiousPeriod: Param<number>
  lengthHospitalStay: Param<number>
  seasonalForcing: Param<number>
  peakMonth: Param<number>
  numberStochasticRuns: Param<number>
}

export interface AllParams {
  ageDistribution: string
  country: string
  importsPerDay: number
  incubationTime: number
  infectiousPeriod: number
  lengthHospitalStay: number
  numberStochasticRuns: number
  peakMonth: number
  populationServed: number
  r0: number
  seasonalForcing: number
  serialInterval: number
  suspectedCasesToday: number
  tMin: Date
  tMax: Date
}
