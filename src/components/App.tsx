import React from 'react'

import { useSelector } from 'react-redux'
import { withErrorBoundary } from 'react-error-boundary'
import { Switch, Route, Redirect, withRouter, RouteComponentProps } from 'react-router'
import ErrorPage from '../pages/ErrorPage'

import Layout from './Layout/Layout'
import LandingPage from './LandingPage/LandingPage'

import '../styles/global.scss'
import { State } from '../state/reducer'

function App({ location }: RouteComponentProps) {
  const shouldGoToLandingPage = useSelector(({ ui }: State) => !ui.skipLandingPage)

  return (
    <Switch>
      <Route exact path="/start" component={LandingPage} />
      {shouldGoToLandingPage && (
        <Redirect
          to={{
            pathname: '/start',
            state: { referrer: location },
          }}
        />
      )}
      <Route component={Layout} />
    </Switch>
  )
}

export default withErrorBoundary(withRouter(App), ErrorPage)
