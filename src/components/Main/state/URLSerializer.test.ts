import '../../../i18n'
import { serializeScenarioToURL, deserializeScenarioFromURL } from './URLSerializer'
import { defaultScenarioState, State } from './state'
import { AllParams, SimulationData } from '../../../algorithms/types/Param.types'
import { TimeSeries } from '../../../algorithms/types/TimeSeries.types'

describe('model', () => {
  let state: State
  let params: AllParams
  let simulation: SimulationData
  let reduction: TimeSeries

  beforeEach(() => {
    simulation = {
      simulationTimeRange: {
        tMin: new Date(),
        tMax: new Date(),
      },
      numberStochasticRuns: 0,
    }

    reduction = [
      {
        y: 5,
        t: new Date(),
      },
    ]

    state = {
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

    params = {
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
    }
  })

  it('can serialize and deserialize a typical scenario', async () => {
    await serializeScenarioToURL(state, params)
    const result = deserializeScenarioFromURL(defaultScenarioState)
    expect(result.current).toEqual('test')
    expect(result.data.simulation).toEqual(simulation)
    expect(result.data.containment.numberPoints).toEqual(reduction.length)
    expect(result.data.containment.reduction).toEqual(reduction)
  })

  it('will return the initial parameters if invalid params are given', async () => {
    await serializeScenarioToURL(state, params)
    const serialized = JSON.parse(decodeURIComponent(window.location.search.slice(1)))
    serialized.current = null // This should be a string
    window.history.pushState('', '', `?${encodeURIComponent(JSON.stringify(serialized))}`)
    const result = deserializeScenarioFromURL(defaultScenarioState)
    expect(result).toEqual(defaultScenarioState)
  })
})
