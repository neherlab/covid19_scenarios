import { AgeDistribution, AgeGroup, Severity } from '../../.generated/types'

import { AllParamsFlat, MitigationIntervals } from '../types/Param.types'

export const mitigationIntervals: MitigationIntervals = [
  {
    id: 'cdfcd00e-385b-4129-8ba9-7bca110edfaf',
    name: 'Measure number one',
    timeRange: {
      tMin: new Date('2020-03-15T04:00:00.000Z'),
      tMax: new Date('2020-09-01T03:00:00.000Z'),
    },
    color: '#00ff00',
    mitigationValue: [38, 58],
  },
  {
    id: '8310ae2f-8053-4eb6-a462-d542f06e01fb',
    name: 'Measure number two',
    timeRange: {
      tMin: new Date('2020-04-03T04:00:00.000Z'),
      tMax: new Date('2020-07-20T03:00:00.000Z'),
    },
    color: '#ff0000',
    mitigationValue: [41, 67],
  },
]

export const allParamsFlat: AllParamsFlat = {
  populationServed: 195000,
  country: 'Switzerland',
  hospitalBeds: 698,
  ICUBeds: 80,
  initialNumberOfCases: 213,
  importsPerDay: 0.1,
  cases: 'CHE-Basel-Stadt',
  r0: [1.6, 2.3],
  latencyTime: 5,
  infectiousPeriod: 3,
  lengthHospitalStay: 4,
  lengthICUStay: 14,
  seasonalForcing: 0.2,
  peakMonth: 0,
  overflowSeverity: 2,
  simulationTimeRange: {
    tMin: new Date('2020-03-01T04:00:00.000Z'),
    tMax: new Date('2020-09-01T03:00:00.000Z'),
  },
  numberStochasticRuns: 0,
  mitigationIntervals,
}

export const severity: Severity[] = [
  {
    id: 0,
    ageGroup: AgeGroup.The09,
    isolated: 0,
    confirmed: 5,
    severe: 1,
    critical: 5,
    fatal: 30,
  },
  {
    id: 2,
    ageGroup: AgeGroup.The1019,
    isolated: 0,
    confirmed: 5,
    severe: 3,
    critical: 10,
    fatal: 30,
  },
  {
    id: 4,
    ageGroup: AgeGroup.The2029,
    isolated: 0,
    confirmed: 10,
    severe: 3,
    critical: 10,
    fatal: 30,
  },
  {
    id: 6,
    ageGroup: AgeGroup.The3039,
    isolated: 0,
    confirmed: 15,
    severe: 3,
    critical: 15,
    fatal: 30,
  },
  {
    id: 8,
    ageGroup: AgeGroup.The4049,
    isolated: 0,
    confirmed: 20,
    severe: 6,
    critical: 20,
    fatal: 30,
  },
  {
    id: 10,
    ageGroup: AgeGroup.The5059,
    isolated: 0,
    confirmed: 25,
    severe: 10,
    critical: 25,
    fatal: 40,
  },
  {
    id: 12,
    ageGroup: AgeGroup.The6069,
    isolated: 0,
    confirmed: 30,
    severe: 25,
    critical: 35,
    fatal: 40,
  },
  {
    id: 14,
    ageGroup: AgeGroup.The7079,
    isolated: 0,
    confirmed: 40,
    severe: 35,
    critical: 45,
    fatal: 50,
  },
  {
    id: 16,
    ageGroup: AgeGroup.The80,
    isolated: 0,
    confirmed: 50,
    severe: 50,
    critical: 55,
    fatal: 50,
  },
]

export const ageDisstribution: AgeDistribution = {
  '0-9': 884945,
  '10-19': 834866,
  '20-29': 1039727,
  '30-39': 1219227,
  '40-49': 1166590,
  '50-59': 1320623,
  '60-69': 977436,
  '70-79': 751994,
  '80+': 459214,
}
