import React from 'react'

import { withErrorBoundary } from 'react-error-boundary'
import ErrorPage from '../pages/ErrorPage'

import Layout from './Layout/Layout'

import '../styles/global.scss'

function App() {
  return (
    <>
      <Layout />
    </>
  )
}

export default withErrorBoundary(App, ErrorPage)
