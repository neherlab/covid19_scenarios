export enum Month {
  Jan = 'Jan',
  Feb = 'Feb',
  Mar = 'Mar',
  Apr = 'Apr',
  May = 'May',
  Jun = 'Jun',
  Jul = 'Jul',
  Aug = 'Aug',
  Sep = 'Sep',
  Oct = 'Oct',
  Nov = 'Nov',
  Dec = 'Dec',
}

export interface Param<ValueType> {
  name: string
  defaultValue: ValueType
}

export interface MainParams {
  populationServed: Param<number>
  ageDistribution: Param<string>
  suspectedCasesToday: Param<number>
  importsPerDay: Param<number>
  tMax: Param<string>
}

export interface AdditionalParams {
  r0: Param<number>
  incubationTime: Param<number>
  infectiousPeriod: Param<number>
  lengthHospitalStay: Param<number>
  seasonalForcing: Param<number>
  peakMonth: Param<Month>
  numberStochasticRuns: Param<number>
}

export interface AllParams {
  populationServed: number
  country: string
  suspectedCasesToday: number
  importsPerDay: number
  r0: number
  serialInterval: number
  seasonalForcing: number
  peakMonth: Month
  numberStochasticRuns: number
  tMax: Param<string>
}
