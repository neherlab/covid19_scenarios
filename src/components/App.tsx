import React, { useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { withErrorBoundary } from 'react-error-boundary'
import { Switch, Route, Redirect } from 'react-router'
import ErrorPage from '../pages/ErrorPage'

import { setAuthObserver, getUserData } from '../helpers/cloudStorage'
import { setCurrentUserUid } from '../state/user/user.actions'

import Layout from './Layout/Layout'
import LandingPage from './LandingPage/LandingPage'

import '../styles/global.scss'
import { State } from '../state/reducer'

import localStorage, { LOCAL_STORAGE_KEYS } from '../helpers/localStorage'

function App() {
  const dispatch = useDispatch()
  const shouldGoToLandingPage = useSelector(({ ui }: State) => !ui.skipLandingPage)
  const initialQueryString = window.location.search

  const handleAuthStateChange = (user: any) => {
    if (user) {
      dispatch(setCurrentUserUid({ currentUserUid: user.uid }))
      fetchAndSetLocalStorageValues(user.uid)
    }
    else {
      dispatch(setCurrentUserUid({ currentUserUid: null }))
    }
  }

  const fetchAndSetLocalStorageValues = async (uid: string) => {
    const data: object | undefined = await getUserData(uid)
    if (!data) {
      return
    } // TODO write localStorage values to firestore

    for (let key in Object.keys(data)) {
      if(Object.keys(LOCAL_STORAGE_KEYS).includes(key)) {
        localStorage.set(key, data[key])
      }
    }
  }

  useEffect(() => {
    setAuthObserver(handleAuthStateChange)
  }, [])

  return (
    <Switch>
      {shouldGoToLandingPage && <Redirect exact from="/" to="/start" />}
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
