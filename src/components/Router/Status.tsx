import React from 'react'

import { Route, RouteComponentProps } from 'react-router'

export interface StatusProps {
  code: number
  children: JSX.Element | JSX.Element[]
}

export default function Status({ code, children }: StatusProps) {
  return (
    <Route
      render={({ staticContext }: RouteComponentProps) => {
        if (staticContext) {
          staticContext.statusCode = code
        }
        return children
      }}
    />
  )
}
