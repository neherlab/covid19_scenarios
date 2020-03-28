import React from 'react'

import { useSelector } from 'react-redux'
import { withErrorBoundary } from 'react-error-boundary'
import { Switch, Route, Redirect } from 'react-router'
import ErrorPage from '../pages/ErrorPage'

import Layout from './Layout/Layout'
import LandingPage from './LandingPage/LandingPage'

import '../styles/global.scss'
import { State } from '../state/reducer'

function App() {
  const shouldGoToLandingPage = useSelector(({ ui }: State) => !ui.skipLandingPage)
  return (
    <Switch>
      {shouldGoToLandingPage && <Redirect exact from="/" to="/start" />}
      <Route exact path="/start">
        <LandingPage />
      </Route>
      <Route>
        <Layout />
      </Route>
    </Switch>
  )
}

export default withErrorBoundary(App, ErrorPage)
