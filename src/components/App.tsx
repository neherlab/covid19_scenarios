import React, { useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { withErrorBoundary } from 'react-error-boundary'
import { Switch, Route, Redirect } from 'react-router'
import ErrorPage from '../pages/ErrorPage'

import { setAuthObserver, getUserData, setUserData } from '../helpers/cloudStorage'
import { setCurrentUserUid } from '../state/user/user.actions'

import { LoginForm } from './LoginForm/LoginForm'
import { SignupForm } from './SignupForm/SignupForm'

import Layout from './Layout/Layout'
import LandingPage from './LandingPage/LandingPage'

import '../styles/global.scss'
import { State } from '../state/reducer'

import localStorage, { LOCAL_STORAGE_KEYS, LOCAL_STORAGE_KEYS_DEFAULT_VALUES } from '../helpers/localStorage'

function App() {
  const loginVisible = useSelector(({ ui }: State) => ui.loginFormVisible)
  const signupVisible = useSelector(({ ui }: State) => ui.signupFormVisible)
  console.log(loginVisible)

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

    let userData = {}

    for (let key of Object.keys(LOCAL_STORAGE_KEYS)) {
      const actualKey = LOCAL_STORAGE_KEYS[key]
      const localStorageData = localStorage.get(actualKey)

      if (data[actualKey] === undefined) {
        userData[actualKey] = localStorageData
      }
      else {
        userData[actualKey] = data[actualKey]
      }
      if (!userData[actualKey]) {
        userData[actualKey] = LOCAL_STORAGE_KEYS_DEFAULT_VALUES[key]
      }
    }
    
    setUserData(uid, userData)
    for (let key of Object.keys(LOCAL_STORAGE_KEYS)) {
      const actualKey = LOCAL_STORAGE_KEYS[key]
      localStorage.set(actualKey, userData[actualKey])
    }
  }

  useEffect(() => {
    setAuthObserver(handleAuthStateChange)
  }, [])

  return (
    <>
      <Switch>
        {shouldGoToLandingPage && <Redirect exact from="/" to="/start" />}
        <Route exact path="/start">
          <LandingPage initialQueryString={initialQueryString} />
        </Route>
        <Route>
          <Layout />
        </Route>
      </Switch>
      {loginVisible && <LoginForm />}
      {signupVisible && <SignupForm />}
    </>
  )
}

export default withErrorBoundary(App, ErrorPage)
