import React from 'react'

import { Else, If, Then, When } from 'react-if'

import './ErrorPage.scss'

interface ErrorProps {
  error?: Error
  componentStack?: string
  isDev?: boolean
}

const development = process.env.NODE_ENV === 'development'

export default function ErrorPage({ error, componentStack, isDev = development }: ErrorProps) {
  const hasDevMessage = !!(isDev && error && error.message)
  const hasDevStack = !!(isDev && componentStack)

  return (
    <>
      <h1 className="h1-error">{'Error'}</h1>

      <If condition={isDev}>
        <Then>
          <div className="error-container-dev error-dev">
            <When condition={hasDevMessage}>
              <h3 className="error-dev">{error && error.message}</h3>
            </When>

            <When condition={hasDevStack}>
              {componentStack && <pre className="error-dev small">{componentStack}</pre>}
            </When>
          </div>
        </Then>
        <Else>
          <h3 className="h3-error text-center">{'Oops! Something went wrong'}</h3>
        </Else>
      </If>
    </>
  )
}
