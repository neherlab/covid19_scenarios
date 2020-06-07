import React from 'react'

import { withErrorBoundary } from 'react-error-boundary'

import ErrorPage from '../pages/ErrorPage'

import Layout from './Layout/Layout'

function App() {
  return <Layout />
}

export default withErrorBoundary(App, { FallbackComponent: ErrorPage })
