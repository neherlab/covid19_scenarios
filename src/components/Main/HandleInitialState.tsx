import React, { useState, useEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import _ from 'lodash'

import { defaultScenarioState, State } from './state/state'
import { Convert } from '../../.generated/types'
import rawSeverityData from '../../assets/data/severityData.json'
import { deserializeScenarioFromURL } from './state/serialization/URLSerializer'
import { Severity } from '../../algorithms/types/Param.types'

const severityData = Convert.toSeverity(JSON.stringify(rawSeverityData))

interface InitialState {
  scenarioState: State
  severityTable: Severity[]
  isDefault: boolean
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

  return (
    <Component
      initialState={{
        scenarioState,
        severityTable: severityData,
        isDefault: _.isEqual(scenarioState, defaultScenarioState),
      }}
    />
  )
}

export default withRouter(HandleInitialState)
