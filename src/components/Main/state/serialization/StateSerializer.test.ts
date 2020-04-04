import { State } from '../state'
import { deserialize, serialize } from './StateSerializer'

const SCENARIOS = ['CHE-Basel-Landschaft', 'Austria']

const STATE: State = {
  scenarios: SCENARIOS,
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

const SERIALIZED_STRING =
  '%7B%22current%22%3A%22CHE-Basel-Stadt%22%2C%22containment%22%3A%5B%7B%22t%22%3A%222020-01-31T00%3A00%3A00.000Z%22%2C%22y%22%3A1%7D%2C%7B%22t%22%3A%222020-02-23T18%3A40%3A00.000Z%22%2C%22y%22%3A1%7D%2C%7B%22t%22%3A%222020-03-18T13%3A20%3A00.000Z%22%2C%22y%22%3A1%7D%2C%7B%22t%22%3A%222020-04-11T08%3A00%3A00.000Z%22%2C%22y%22%3A1%7D%2C%7B%22t%22%3A%222020-05-05T02%3A40%3A00.000Z%22%2C%22y%22%3A1%7D%2C%7B%22t%22%3A%222020-05-28T21%3A20%3A00.000Z%22%2C%22y%22%3A1%7D%2C%7B%22t%22%3A%222020-06-21T16%3A00%3A00.000Z%22%2C%22y%22%3A1%7D%2C%7B%22t%22%3A%222020-07-15T10%3A40%3A00.000Z%22%2C%22y%22%3A1%7D%2C%7B%22t%22%3A%222020-08-08T05%3A20%3A00.000Z%22%2C%22y%22%3A1%7D%2C%7B%22t%22%3A%222020-09-01T00%3A00%3A00.000Z%22%2C%22y%22%3A1%7D%5D%2C%22population%22%3A%7B%22ICUBeds%22%3A80%2C%22cases%22%3A%22CHE-Basel-Stadt%22%2C%22country%22%3A%22Switzerland%22%2C%22hospitalBeds%22%3A698%2C%22importsPerDay%22%3A0.1%2C%22populationServed%22%3A195000%2C%22suspectedCasesToday%22%3A10%7D%2C%22epidemiological%22%3A%7B%22infectiousPeriod%22%3A3%2C%22latencyTime%22%3A5%2C%22lengthHospitalStay%22%3A4%2C%22lengthICUStay%22%3A14%2C%22overflowSeverity%22%3A2%2C%22peakMonth%22%3A0%2C%22r0%22%3A2%2C%22seasonalForcing%22%3A0.2%7D%2C%22simulation%22%3A%7B%22simulationTimeRange%22%3A%7B%22tMin%22%3A%222020-01-31T00%3A00%3A00.000Z%22%2C%22tMax%22%3A%222020-09-01T00%3A00%3A00.000Z%22%7D%2C%22numberStochasticRuns%22%3A0%7D%7D'
const SERIALIZED_STRING_AUSTRIA =
  '%7B%22current%22%3A%22Austria%22%2C%22containment%22%3A%5B%7B%22t%22%3A%222020-01-31T00%3A00%3A00.000Z%22%2C%22y%22%3A1%7D%2C%7B%22t%22%3A%222020-02-23T18%3A40%3A00.000Z%22%2C%22y%22%3A1%7D%2C%7B%22t%22%3A%222020-03-18T13%3A20%3A00.000Z%22%2C%22y%22%3A1%7D%2C%7B%22t%22%3A%222020-04-11T08%3A00%3A00.000Z%22%2C%22y%22%3A1%7D%2C%7B%22t%22%3A%222020-05-05T02%3A40%3A00.000Z%22%2C%22y%22%3A1%7D%2C%7B%22t%22%3A%222020-05-28T21%3A20%3A00.000Z%22%2C%22y%22%3A1%7D%2C%7B%22t%22%3A%222020-06-21T16%3A00%3A00.000Z%22%2C%22y%22%3A1%7D%2C%7B%22t%22%3A%222020-07-15T10%3A40%3A00.000Z%22%2C%22y%22%3A1%7D%2C%7B%22t%22%3A%222020-08-08T05%3A20%3A00.000Z%22%2C%22y%22%3A1%7D%2C%7B%22t%22%3A%222020-09-01T00%3A00%3A00.000Z%22%2C%22y%22%3A1%7D%5D%2C%22population%22%3A%7B%22ICUBeds%22%3A80%2C%22cases%22%3A%22CHE-Basel-Stadt%22%2C%22country%22%3A%22Switzerland%22%2C%22hospitalBeds%22%3A698%2C%22importsPerDay%22%3A0.1%2C%22populationServed%22%3A195000%2C%22suspectedCasesToday%22%3A10%7D%2C%22epidemiological%22%3A%7B%22infectiousPeriod%22%3A3%2C%22latencyTime%22%3A5%2C%22lengthHospitalStay%22%3A4%2C%22lengthICUStay%22%3A14%2C%22overflowSeverity%22%3A2%2C%22peakMonth%22%3A0%2C%22r0%22%3A2%2C%22seasonalForcing%22%3A0.2%7D%2C%22simulation%22%3A%7B%22simulationTimeRange%22%3A%7B%22tMin%22%3A%222020-01-31T00%3A00%3A00.000Z%22%2C%22tMax%22%3A%222020-09-01T00%3A00%3A00.000Z%22%7D%2C%22numberStochasticRuns%22%3A0%7D%7D' // current = Austria

describe('StateSerializer', () => {
  it('serializes the state', () => {
    expect(serialize(STATE)).toBe(SERIALIZED_STRING)
  })

  describe('deserializes the state', () => {
    it('from query string fully represents current state', () => {
      expect(deserialize(SERIALIZED_STRING, STATE)).toEqual(STATE)
    })

    it('from query string does not represent current state', () => {
      expect(deserialize(SERIALIZED_STRING_AUSTRIA, STATE)).toEqual({
        ...STATE,
        current: 'Austria',
      })
    })
  })
})
