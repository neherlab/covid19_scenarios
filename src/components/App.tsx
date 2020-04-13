import React, { useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { withErrorBoundary } from 'react-error-boundary'

import ErrorPage from '../pages/ErrorPage'

import { setAuthObserver, getUserData, setUserData } from '../helpers/cloudStorage'
import { setCurrentUserUid, setCurrentUserPhoto } from '../state/user/user.actions'

import { LoginForm } from './LoginForm/LoginForm'
import { SignupForm } from './SignupForm/SignupForm'

import Layout from './Layout/Layout'

import '../styles/global.scss'

import localStorage, { LOCAL_STORAGE_KEYS, LOCAL_STORAGE_KEYS_DEFAULT_VALUES } from '../helpers/localStorage'

function App() {
  const loginVisible = useSelector(({ ui }: State) => ui.loginFormVisible)
  const signupVisible = useSelector(({ ui }: State) => ui.signupFormVisible)

  const dispatch = useDispatch()
  const initialQueryString = window.location.search

  const handleAuthStateChange = (user: any) => {
    if (user) {
      dispatch(setCurrentUserUid({ currentUserUid: user.uid }))
      dispatch(setCurrentUserPhoto({ currentUserPhoto: user.photoURL }))
      fetchAndSetLocalStorageValues(user.uid)
    } else {
      dispatch(setCurrentUserUid({ currentUserUid: null }))
      dispatch(setCurrentUserPhoto({ currentUserPhoto: null }))
    }
  }

  const fetchAndSetLocalStorageValues = async (uid: string) => {
    const data: object | undefined = await getUserData(uid)

    let userData = {}

    for (let key of Object.keys(LOCAL_STORAGE_KEYS)) {
      const actualKey = LOCAL_STORAGE_KEYS[key]
      const localStorageData = localStorage.get(actualKey)

      if (data[actualKey] === undefined) {
        userData[actualKey] = localStorageData
      } else {
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
      <Layout />
      {loginVisible && <LoginForm />}
      {signupVisible && <SignupForm />}
    </>
  )
}

export default withErrorBoundary(App, ErrorPage)
