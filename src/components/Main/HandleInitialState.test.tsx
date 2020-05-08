import { ConnectedRouter } from 'connected-react-router'
import React from 'react'

import { render } from '@testing-library/react'
import { Provider } from 'react-redux'

import configureStore from '../../state/store'

import { DEFAULT_OVERALL_SCENARIO_NAME } from './state/state'

import HandleInitialState, { InitialStateComponentProps } from './HandleInitialState'

import { severity } from '../../algorithms/__test_data__/getPopulationParams.input.default'

interface ThisTestProps {
  url?: string
  location?: Location
  component: React.FC<InitialStateComponentProps>
}

function HandleInitialStateTestWrapper({ url, location, ...props }: ThisTestProps) {
  const testLocation = location ?? ({ pathname: url } as Location)
  const { store, history } = configureStore({ location: testLocation })

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <HandleInitialState {...props} />
      </ConnectedRouter>
    </Provider>
  )
}

describe('HandleInitialState', () => {
  it('renders a component', () => {
    const { getByText } = render(<HandleInitialStateTestWrapper component={() => <span>wrapped</span>} />)

    expect(getByText('wrapped')).not.toBeNull()
  })

  it('passes initial scenario state', () => {
    const { getByText } = render(
      <HandleInitialStateTestWrapper
        component={({ initialState }) => (
          <span>
            {initialState.scenarioState.data.population.ageDistributionName} {initialState.isDefault ? 'true' : 'false'}
          </span>
        )}
      />,
    )

    expect(getByText(`${DEFAULT_OVERALL_SCENARIO_NAME} true`)).not.toBeNull()
  })

  it('passes initial severity state', () => {
    const { getByText } = render(
      <HandleInitialStateTestWrapper
        component={({ initialState }) => <span>{initialState.severityTable[0].ageGroup}</span>}
      />,
    )

    expect(getByText(severity[0].ageGroup)).not.toBeNull()
  })

  it('retrieves state from the URL', () => {
    const { getByText } = render(
      <HandleInitialStateTestWrapper
        location={
          {
            pathname: '/',
            search:
              "q=~(ageDistributionData~(data~(~(ageGroup~'0-9~population~4994996)~(ageGroup~'10-19~population~5733447)~(ageGroup~'20-29~population~6103437)~(ageGroup~'30-39~population~6998434)~(ageGroup~'40-49~population~9022004)~(ageGroup~'50-59~population~9567192)~(ageGroup~'60-69~population~7484860)~(ageGroup~'70-79~population~6028907)~(ageGroup~'80*2b~population~4528548))~name~'Italy)~scenarioData~(data~(epidemiological~(hospitalStayDays~3~icuStayDays~14~infectiousPeriodDays~3~latencyDays~3~overflowSeverity~2~peakMonth~0~r0~(begin~3.14~end~3.83)~seasonalForcing~0)~mitigation~(mitigationIntervals~(~(color~'*23bf5b17~name~'Intervention*20*231~timeRange~(begin~'2020-03-08T00*3a00*3a00.000Z~end~'2020-09-01T00*3a00*3a00.000Z)~transmissionReduction~(begin~45~end~55))~(color~'*23666666~name~'Intervention*20*232~timeRange~(begin~'2020-03-21T00*3a00*3a00.000Z~end~'2020-09-01T00*3a00*3a00.000Z)~transmissionReduction~(begin~54~end~66))))~population~(ageDistributionName~'Italy~caseCountsName~'Italy~hospitalBeds~158891~icuBeds~7550~importsPerDay~0.1~initialNumberOfCases~66~populationServed~60431283)~simulation~(numberStochasticRuns~15~simulationTimeRange~(begin~'2020-02-02T00*3a00*3a00.000Z~end~'2020-08-31T00*3a00*3a00.000Z)))~name~'Italy)~schemaVer~'2.0.0~severityDistributionData~(data~(~(ageGroup~'0-9~confirmed~5~critical~5~fatal~30~isolated~0~severe~1)~(ageGroup~'10-19~confirmed~5~critical~10~fatal~30~isolated~0~severe~3)~(ageGroup~'20-29~confirmed~10~critical~10~fatal~30~isolated~0~severe~3)~(ageGroup~'30-39~confirmed~15~critical~15~fatal~30~isolated~0~severe~3)~(ageGroup~'40-49~confirmed~20~critical~20~fatal~30~isolated~0~severe~6)~(ageGroup~'50-59~confirmed~25~critical~25~fatal~40~isolated~0~severe~10)~(ageGroup~'60-69~confirmed~30~critical~35~fatal~40~isolated~0~severe~25)~(ageGroup~'70-79~confirmed~40~critical~45~fatal~50~isolated~0~severe~35)~(ageGroup~'80*2b~confirmed~50~critical~55~fatal~50~isolated~0~severe~50))~name~'China*20CDC))&v=1",
          } as Location
        }
        component={({ initialState }) => <span>{initialState.scenarioState.current}</span>}
      />,
    )

    expect(getByText('Italy')).toBeInTheDocument()
  })

  it('clears search parameters from the URL', () => {
    const { store, history } = configureStore({ location: { pathname: '/', search: '?clearthis' } as Location })

    render(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <HandleInitialState component={() => <span>wrapped</span>} />
        </ConnectedRouter>
      </Provider>,
    )

    expect(store.getState().router.location.pathname).toBe('/')
    expect(store.getState().router.location.search).toBe('')
  })
})
