import { PersistedState, PersistedStateDto } from '../../../../algorithms/types/Param.types'
import { fromDto, toDto } from './DtoConverter'

const STATE: PersistedState = {
  current: 'CHE-Basel-Stadt',
  data: {
    population: {
      ICUBeds: 80,
      cases: 'CHE-Basel-Stadt',
      country: 'Switzerland',
      hospitalBeds: 698,
      importsPerDay: 0.1,
      populationServed: 195000,
      suspectedCasesToday: 10,
    },
    epidemiological: {
      infectiousPeriod: 3,
      latencyTime: 5,
      lengthHospitalStay: 4,
      lengthICUStay: 14,
      overflowSeverity: 2,
      peakMonth: 0,
      r0: 2,
      seasonalForcing: 0.2,
    },
    containment: {
      reduction: [
        { t: new Date('2020-01-31T00:00:00.000Z'), y: 1 },
        { t: new Date('2020-02-23T18:40:00.000Z'), y: 1 },
        { t: new Date('2020-03-18T13:20:00.000Z'), y: 1 },
        { t: new Date('2020-04-11T08:00:00.000Z'), y: 1 },
        { t: new Date('2020-05-05T02:40:00.000Z'), y: 1 },
        { t: new Date('2020-05-28T21:20:00.000Z'), y: 1 },
        { t: new Date('2020-06-21T16:00:00.000Z'), y: 1 },
        { t: new Date('2020-07-15T10:40:00.000Z'), y: 1 },
        { t: new Date('2020-08-08T05:20:00.000Z'), y: 1 },
        { t: new Date('2020-09-01T00:00:00.000Z'), y: 1 },
      ],
      numberPoints: 10,
    },
    simulation: {
      simulationTimeRange: { tMin: new Date('2020-01-31T00:00:00.000Z'), tMax: new Date('2020-09-01T00:00:00.000Z') },
      numberStochasticRuns: 0,
    },
  },
}

const DTO: PersistedStateDto = {
  current: 'CHE-Basel-Stadt',
  population: {
    ICUBeds: 80,
    cases: 'CHE-Basel-Stadt',
    country: 'Switzerland',
    hospitalBeds: 698,
    importsPerDay: 0.1,
    populationServed: 195000,
    suspectedCasesToday: 10,
  },
  epidemiological: {
    infectiousPeriod: 3,
    latencyTime: 5,
    lengthHospitalStay: 4,
    lengthICUStay: 14,
    overflowSeverity: 2,
    peakMonth: 0,
    r0: 2,
    seasonalForcing: 0.2,
  },
  containment: [
    { t: new Date('2020-01-31T00:00:00.000Z'), y: 1 },
    { t: new Date('2020-02-23T18:40:00.000Z'), y: 1 },
    { t: new Date('2020-03-18T13:20:00.000Z'), y: 1 },
    { t: new Date('2020-04-11T08:00:00.000Z'), y: 1 },
    { t: new Date('2020-05-05T02:40:00.000Z'), y: 1 },
    { t: new Date('2020-05-28T21:20:00.000Z'), y: 1 },
    { t: new Date('2020-06-21T16:00:00.000Z'), y: 1 },
    { t: new Date('2020-07-15T10:40:00.000Z'), y: 1 },
    { t: new Date('2020-08-08T05:20:00.000Z'), y: 1 },
    { t: new Date('2020-09-01T00:00:00.000Z'), y: 1 },
  ],
  simulation: {
    simulationTimeRange: { tMin: new Date('2020-01-31T00:00:00.000Z'), tMax: new Date('2020-09-01T00:00:00.000Z') },
    numberStochasticRuns: 0,
  },
}

describe('DtoConverter', () => {
  it('converts state to DTO', () => {
    expect(toDto(STATE)).toEqual(DTO)
  })

  it('converts DTO to state', () => {
    expect(fromDto(DTO)).toEqual(STATE)
  })
})
