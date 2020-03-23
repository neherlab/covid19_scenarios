import React from 'react'

import { withErrorBoundary } from 'react-error-boundary'
import ErrorPage from '../pages/ErrorPage'

// import Layout from './Layout/Layout'
import LandingPage from './LandingPage/LandingPage'

import '../styles/global.scss'

function App() {
  return (
    <>
      <LandingPage />
      {/* <Layout /> */}
    </>
  )
}

export default withErrorBoundary(App, ErrorPage)
