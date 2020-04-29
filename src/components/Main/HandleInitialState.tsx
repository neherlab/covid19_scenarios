import React, { useState, useEffect } from 'react'

import { isEqual, isEmpty } from 'lodash'

import { connect } from 'react-redux'
import type { Location } from 'history'
import { push } from 'connected-react-router'

import type { SeverityDistributionDatum } from '../../algorithms/types/Param.types'

import { State as AppState } from '../../state/reducer'

import { scenarioNames } from './state/getScenario'
import { dataFromUrl } from './state/serialize'

import { defaultScenarioState, State } from './state/state'

import { getSeverityDistribution } from './state/getSeverityDistribution'

export const DEFAULT_SEVERITY_DISTRIBUTION = 'China CDC'
const severityDistribution = getSeverityDistribution(DEFAULT_SEVERITY_DISTRIBUTION)

function deserializeScenarioFromURL(location: Location) {
  const search = location?.search
  if (!search || isEmpty(search)) {
    return defaultScenarioState
  }

  const data = dataFromUrl(search)
  if (!data) {
    return defaultScenarioState
  }

  return {
    scenarios: scenarioNames,
    current: data.scenarioName,
    data: data.scenario,
    ageDistribution: data.ageDistribution,
  }
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
  location: Location
  component: React.ComponentType<InitialStateComponentProps>
}

function HandleInitialState({ location, component: Component }: HandleInitialStateProps) {
  const [scenarioState] = useState<State>(deserializeScenarioFromURL(location))

  useEffect(() => {
    if (location.search) {
      push('/')
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

const mapStateToProps = (state: AppState) => ({
  location: state.router.location,
})

export default connect(mapStateToProps)(HandleInitialState)
