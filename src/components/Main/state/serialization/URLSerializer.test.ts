import { State } from '../state'
import { buildLocationSearch, updateBrowserURL } from './URLSerializer'

const SCENARIOS = ['CHE-Basel-Landschaft', 'CHE-Basel-Stadt']

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
      initialNumberOfCases: 10,
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
      mitigationIntervals: [
        {
          color: '#bf5b17',
          id: '06ad1640-ce01-41c0-8dc2-78fbbfbd8dd6',
          mitigationValue: 0.2,
          name: 'Intervention #1',
          timeRange: {
            tMin: new Date('2020-03-12T00:00:00.000Z'),
            tMax: new Date('2020-09-01T00:00:00.000Z'),
          },
        },
        {
          color: '#666666',
          id: 'a353e47f-ed52-4517-9cb5-063878edbbca',
          mitigationValue: 0.6,
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
}

const SERIALIZED_STATE =
  "~(current~'CHE-Basel-Stadt~containment~(~(id~'06ad1640-ce01-41c0-8dc2-78fbbfbd8dd6~name~'Intervention*20*231~color~'*23bf5b17~mitigationValue~0.2~timeRange~(tMin~1583971200000~tMax~1598918400000))~(id~'a353e47f-ed52-4517-9cb5-063878edbbca~name~'Intervention*20*232~color~'*23666666~mitigationValue~0.6~timeRange~(tMin~1585440000000~tMax~1598918400000)))~population~(ICUBeds~80~cases~'CHE-Basel-Stadt~country~'Switzerland~hospitalBeds~698~importsPerDay~0.1~populationServed~195000~initialNumberOfCases~10)~epidemiological~(infectiousPeriod~3~latencyTime~5~lengthHospitalStay~4~lengthICUStay~14~overflowSeverity~2~peakMonth~0~r0~2~seasonalForcing~0.2)~simulation~(simulationTimeRange~(tMin~1580428800000~tMax~1598918400000)~numberStochasticRuns~0))"
const LOCATION_SEARCH = `?v=1&q=${SERIALIZED_STATE}`

describe('URLSerializer', () => {
  afterEach(jest.clearAllMocks)

  it('serializes application state and builds the location.search', () => {
    expect(buildLocationSearch(STATE)).toBe(LOCATION_SEARCH)
  })

  it('pushes to browser history', () => {
    const spy = jest.spyOn(window.history, 'pushState')

    updateBrowserURL('?foo=1&bar=baz')

    expect(spy).toHaveBeenCalledWith('', '', '?foo=1&bar=baz')
  })
})
