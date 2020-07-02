import { UUIDv4 } from '../../helpers/uuid'
import { AgeGroup } from '../types/Param.types'

import type {
  AgeDistributionDatum,
  MitigationInterval,
  ScenarioFlat,
  SeverityDistributionDatum,
} from '../types/Param.types'

export const mitigationIntervals: MitigationInterval[] = [
  {
    id: 'cdfcd00e-385b-4129-8ba9-7bca110edfaf' as UUIDv4,
    name: 'Measure number one',
    timeRange: {
      begin: new Date('2020-03-15T04:00:00.000Z'),
      end: new Date('2020-09-01T03:00:00.000Z'),
    },
    color: '#00ff00',
    transmissionReduction: { begin: 38, end: 38 },
  },
  {
    id: '8310ae2f-8053-4eb6-a462-d542f06e01fb' as UUIDv4,
    name: 'Measure number two',
    timeRange: {
      begin: new Date('2020-04-03T04:00:00.000Z'),
      end: new Date('2020-07-20T03:00:00.000Z'),
    },
    color: '#ff0000',
    transmissionReduction: { begin: 67, end: 67 },
  },
]

export const allParamsFlat: ScenarioFlat = {
  populationServed: 195000,
  ageDistributionName: 'Switzerland',
  hospitalBeds: 698,
  icuBeds: 80,
  initialNumberOfCases: 213,
  importsPerDay: 0.1,
  caseCountsName: 'CHE-Basel-Stadt',
  r0: { begin: 2.2, end: 2.2 },
  latencyDays: 5,
  infectiousPeriodDays: 3,
  hospitalStayDays: 4,
  icuStayDays: 14,
  seasonalForcing: 0.2,
  peakMonth: 0,
  overflowSeverity: 2,
  simulationTimeRange: {
    begin: new Date('2020-03-01T04:00:00.000Z'),
    end: new Date('2020-09-01T03:00:00.000Z'),
  },
  numberStochasticRuns: 1,
  mitigationIntervals,
}

export const severity: SeverityDistributionDatum[] = [
  {
    ageGroup: AgeGroup.The09,
    isolated: 0,
    palliative: 0,
    confirmed: 5,
    severe: 1,
    critical: 5,
    fatal: 30,
  },
  {
    ageGroup: AgeGroup.The1019,
    isolated: 0,
    palliative: 0,
    confirmed: 5,
    severe: 3,
    critical: 10,
    fatal: 30,
  },
  {
    ageGroup: AgeGroup.The2029,
    isolated: 0,
    palliative: 0,
    confirmed: 10,
    severe: 3,
    critical: 10,
    fatal: 30,
  },
  {
    ageGroup: AgeGroup.The3039,
    isolated: 0,
    palliative: 0,
    confirmed: 15,
    severe: 3,
    critical: 15,
    fatal: 30,
  },
  {
    ageGroup: AgeGroup.The4049,
    isolated: 0,
    palliative: 0,
    confirmed: 20,
    severe: 6,
    critical: 20,
    fatal: 30,
  },
  {
    ageGroup: AgeGroup.The5059,
    isolated: 0,
    palliative: 0,
    confirmed: 25,
    severe: 10,
    critical: 25,
    fatal: 40,
  },
  {
    ageGroup: AgeGroup.The6069,
    isolated: 0,
    palliative: 0,
    confirmed: 30,
    severe: 25,
    critical: 35,
    fatal: 40,
  },
  {
    ageGroup: AgeGroup.The7079,
    isolated: 0,
    palliative: 0,
    confirmed: 40,
    severe: 35,
    critical: 45,
    fatal: 50,
  },
  {
    ageGroup: AgeGroup.The80,
    isolated: 0,
    palliative: 0,
    confirmed: 50,
    severe: 50,
    critical: 55,
    fatal: 50,
  },
]

export const ageDistribution: AgeDistributionDatum[] = [
  { ageGroup: AgeGroup.The09, population: 884945 },
  { ageGroup: AgeGroup.The1019, population: 834866 },
  { ageGroup: AgeGroup.The2029, population: 1039727 },
  { ageGroup: AgeGroup.The3039, population: 1219227 },
  { ageGroup: AgeGroup.The4049, population: 1166590 },
  { ageGroup: AgeGroup.The5059, population: 1320623 },
  { ageGroup: AgeGroup.The6069, population: 977436 },
  { ageGroup: AgeGroup.The7079, population: 751994 },
  { ageGroup: AgeGroup.The80, population: 459214 },
]
