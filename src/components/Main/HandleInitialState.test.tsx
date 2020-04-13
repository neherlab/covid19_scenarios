import React from 'react'
import { render } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory, Location } from 'history'
import HandleInitialState, { HandleInitialStateProps } from './HandleInitialState'
import { State, DEFAULT_OVERALL_SCENARIO_NAME } from './state/state'
import severityData from '../../assets/data/severityData.json'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('./state/serialization/URLSerializer')

jest.mock('./state/serialization/URLSerializer', () => ({
  deserializeScenarioFromURL: (location: Location, state: State): State => {
    return {
      ...state,
      ...(location.search ? { current: location.search } : {}),
    }
  },
}))

interface ThisTestProps extends HandleInitialStateProps {
  testPushURL?: string
}

const ThisTest = ({ testPushURL, ...props }: ThisTestProps) => {
  const history = createMemoryHistory()
  if (testPushURL) {
    history.push(testPushURL)
  }

  return (
    <Router history={history}>
      <HandleInitialState {...props} />
    </Router>
  )
}

describe('HandleInitialState', () => {
  it('renders a component', () => {
    const { getByText } = render(<ThisTest component={() => <span>wrapped</span>} />)

    expect(getByText('wrapped')).not.toBeNull()
  })

  it('passes initial scenario state', () => {
    const { getByText } = render(
      <ThisTest component={({ initialState }) => <span>{initialState.scenarioState.data.population.country}</span>} />,
    )

    expect(getByText(DEFAULT_OVERALL_SCENARIO_NAME)).not.toBeNull()
  })

  it('passes initial severity state', () => {
    const { getByText } = render(
      <ThisTest component={({ initialState }) => <span>{initialState.severityTable[0].ageGroup}</span>} />,
    )

    expect(getByText(severityData[0].ageGroup)).not.toBeNull()
  })

  it('may pull state from the URL', () => {
    const { getByText } = render(
      <ThisTest
        testPushURL="/path?something_to_deserialize"
        component={({ initialState }) => <span>{initialState.scenarioState.current}</span>}
      />,
    )

    expect(getByText('?something_to_deserialize')).not.toBeNull()
  })

  it('clears search parameters from the URL', () => {
    const history = createMemoryHistory()
    history.push('/somewhere?state')
    history.push = jest.fn()

    render(
      <Router history={history}>
        <HandleInitialState component={() => <span>wrapped</span>} />
      </Router>,
    )

    expect(history.push).toHaveBeenCalledWith('/')
  })

  it('may not clear the URL when there is no search', () => {
    const history = createMemoryHistory()
    history.push('/somewhere')
    history.push = jest.fn()

    render(
      <Router history={history}>
        <HandleInitialState component={() => <span>wrapped</span>} />
      </Router>,
    )

    expect(history.push).not.toHaveBeenCalled()
  })
})
