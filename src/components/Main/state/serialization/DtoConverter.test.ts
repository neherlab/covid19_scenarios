import { fromDto, toDto } from './DtoConverter'
import { PersistedState } from './types/PersistedState.types'
import { PersistedStateDto } from './types/PersistedStateDto.types'

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
      initialNumberOfCases: 10,
    },
    epidemiological: {
      infectiousPeriod: 3,
      latencyTime: 5,
      lengthHospitalStay: 4,
      lengthICUStay: 14,
      overflowSeverity: 2,
      peakMonth: 0,
      r0: [1.9, 2.1],
      seasonalForcing: 0.2,
    },
    containment: {
      mitigationIntervals: [
        {
          color: '#bf5b17',
          id: '06ad1640-ce01-41c0-8dc2-78fbbfbd8dd6',
          mitigationValue: [0.19, 0.21],
          name: 'Intervention #1',
          timeRange: {
            tMin: new Date('2020-03-12T00:00:00.000Z'),
            tMax: new Date('2020-09-01T00:00:00.000Z'),
          },
        },
        {
          color: '#666666',
          id: 'a353e47f-ed52-4517-9cb5-063878edbbca',
          mitigationValue: [0.59, 0.61],
          name: 'Intervention #2',
          timeRange: {
            tMin: new Date('2020-03-29T00:00:00.000Z'),
            tMax: new Date('2020-09-01T00:00:00.000Z'),
          },
        },
      ],
    },
    simulation: {
      simulationTimeRange: { tMin: new Date('2020-01-31T00:00:00.000Z'), tMax: new Date('2020-09-01T00:00:00.000Z') },
      numberStochasticRuns: 0,
    },
  },
  ageDistribution: {
    '0-9': 0,
    '10-19': 10,
    '20-29': 20,
    '30-39': 20,
    '40-49': 20,
    '50-59': 10,
    '60-69': 10,
    '70-79': 10,
    '80+': 0,
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
    initialNumberOfCases: 10,
  },
  epidemiological: {
    infectiousPeriod: 3,
    latencyTime: 5,
    lengthHospitalStay: 4,
    lengthICUStay: 14,
    overflowSeverity: 2,
    peakMonth: 0,
    r0: [1.9, 2.1],
    seasonalForcing: 0.2,
  },
  containment: [
    {
      color: '#bf5b17',
      id: '06ad1640-ce01-41c0-8dc2-78fbbfbd8dd6',
      mitigationValue: [0.19, 0.21],
      name: 'Intervention #1',
      timeRange: {
        tMax: 1598918400000,
        tMin: 1583971200000,
      },
    },
    {
      color: '#666666',
      id: 'a353e47f-ed52-4517-9cb5-063878edbbca',
      mitigationValue: [0.59, 0.61],
      name: 'Intervention #2',
      timeRange: {
        tMax: 1598918400000,
        tMin: 1585440000000,
      },
    },
  ],
  simulation: {
    simulationTimeRange: { tMax: 1598918400000, tMin: 1580428800000 },
    numberStochasticRuns: 0,
  },
  ageDistribution: {
    '0-9': 0,
    '10-19': 10,
    '20-29': 20,
    '30-39': 20,
    '40-49': 20,
    '50-59': 10,
    '60-69': 10,
    '70-79': 10,
    '80+': 0,
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
