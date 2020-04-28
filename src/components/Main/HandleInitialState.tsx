import React, { useState, useEffect } from 'react'

import { isEqual } from 'lodash'

import History from 'history'
import { withRouter, RouteComponentProps } from 'react-router'

import type { SeverityDistributionDatum } from '../../algorithms/types/Param.types'

import { defaultScenarioState, State } from './state/state'

import { getSeverityDistribution } from './state/getSeverityDistribution'

export const DEFAULT_SEVERITY_DISTRIBUTION = 'China CDC'
const severityDistribution = getSeverityDistribution(DEFAULT_SEVERITY_DISTRIBUTION)

function deserializeScenarioFromURL(location: History.Location) {
  // TODO: actually deserialize the URL
  return defaultScenarioState
}

interface InitialState {
  scenarioState: State
  severityName: string
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
  const [scenarioState] = useState<State>(deserializeScenarioFromURL(location))

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
        severityName: DEFAULT_SEVERITY_DISTRIBUTION,
        severityTable: severityDistribution,
        isDefault: isEqual(scenarioState, defaultScenarioState),
      }}
    />
  )
}

export default withRouter(HandleInitialState)
