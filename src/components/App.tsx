import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { withErrorBoundary } from 'react-error-boundary'
import { Switch, Route } from 'react-router'

import _ from 'lodash'

import ErrorPage from '../pages/ErrorPage'

import Layout from './Layout/Layout'
import LandingPage from './LandingPage/LandingPage'

import '../styles/global.scss'
import { State } from '../state/reducer'

function App() {
  const shouldGoToLandingPage = useSelector(({ ui }: State) => !ui.skipLandingPage)
  const initialQueryString = window.location.search
  let history = useHistory()
  return (
    <Switch>
      {shouldGoToLandingPage &&
        history.location.pathname === '/' &&
        _.isEmpty(history.location.search) &&
        history.push('/start')}
      <Route exact path="/start">
        <LandingPage initialQueryString={initialQueryString} />
      </Route>
      <Route>
        <Layout />
      </Route>
    </Switch>
  )
}

export default withErrorBoundary(App, ErrorPage)
