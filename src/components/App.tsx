import React from 'react'

import { withErrorBoundary } from 'react-error-boundary'
import { Switch, Route, Redirect } from 'react-router'
import ErrorPage from '../pages/ErrorPage'

import Layout from './Layout/Layout'
import LandingPage from './LandingPage/LandingPage'

import '../styles/global.scss'

function App() {
  const skipLandingPage = localStorage.getItem('skip-landing-page')
  return (
    <Switch>
      {!skipLandingPage && <Redirect exact from="/" to="/start" />}
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
