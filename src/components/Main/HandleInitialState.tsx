import React, { useState, useEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router'

import { defaultScenarioState, State } from './state/state'
import { SeverityTableRow } from './Scenario/ScenarioTypes'
import severityData from '../../assets/data/severityData.json'
import { deserializeScenarioFromURL } from './state/serialization/URLSerializer'

interface InitialState {
  scenarioState: State
  severityTable: SeverityTableRow[]
}

export interface InitialStateComponentProps {
  initialState: InitialState
}

export interface HandleInitialStateProps {
  component: React.ComponentType<InitialStateComponentProps>
}

function HandleInitialState({
  history,
  location,
  component: Component,
}: RouteComponentProps<{}> & HandleInitialStateProps) {
  const [scenarioState] = useState<State>(deserializeScenarioFromURL(location, defaultScenarioState))

  useEffect(() => {
    if (location.search) {
      history.push('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Component initialState={{ scenarioState, severityTable: severityData }} />
}

export default withRouter(HandleInitialState)
