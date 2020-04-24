import React, { useState, useEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router'

import _ from 'lodash'

import { defaultScenarioState, State } from './state/state'
import { deserializeScenarioFromURL } from './state/serialization/URLSerializer'

import { getSeverityDistribution } from './state/getSeverityDistribution'

import { SeverityDistributionDatum } from '../../.generated/types'

const DEFAULT_SEVERITY_DISTRIBUTION = 'China CDC'
const severityDistribution = getSeverityDistribution(DEFAULT_SEVERITY_DISTRIBUTION)

interface InitialState {
  scenarioState: State
  severityTable: SeverityDistributionDatum[]
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
        severityTable: severityDistribution,
        isDefault: _.isEqual(scenarioState, defaultScenarioState),
      }}
    />
  )
}

export default withRouter(HandleInitialState)
