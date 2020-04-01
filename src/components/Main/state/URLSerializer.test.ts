import '../../../i18n'
import { serializeScenarioToURL, deserializeScenarioFromURL } from './URLSerializer'
import { defaultScenarioState, State } from './state'

describe('model', () => {
  it('can serialize and deserialize a typical scenario', async () => {
    const simulation = {
      simulationTimeRange: {
        tMin: new Date(),
        tMax: new Date(),
      },
      numberStochasticRuns: 0,
    }

    const reduction = [
      {
        y: 5,
        t: new Date(),
      },
    ]

    const copy: State = {
      ...defaultScenarioState,
      current: 'test',
      data: {
        ...defaultScenarioState.data,
        containment: {
          numberPoints: reduction.length,
          reduction,
        },
      },
    }

    await serializeScenarioToURL(copy, {
      population: {
        populationServed: 0,
        country: '',
        suspectedCasesToday: 0,
        importsPerDay: 0,
        hospitalBeds: 0,
        ICUBeds: 0,
        cases: '',
      },
      epidemiological: {
        r0: 0,
        latencyTime: 0,
        infectiousPeriod: 0,
        lengthHospitalStay: 0,
        lengthICUStay: 0,
        seasonalForcing: 0,
        peakMonth: 0,
        overflowSeverity: 0,
      },
      simulation,
      containment: {
        numberPoints: 0,
        reduction: [],
      },
    })

    const result = deserializeScenarioFromURL(defaultScenarioState)
    expect(result.current).toEqual('test')
    expect(result.data.simulation).toEqual(simulation)
    expect(result.data.containment.numberPoints).toEqual(reduction.length)
    expect(result.data.containment.reduction).toEqual(reduction)
  })
})
