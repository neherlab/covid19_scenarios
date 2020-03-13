import React from 'react'

import { Redirect as RouterRedirect, RedirectProps as RouterRedirectProps, Route } from 'react-router'

export interface RedirectProps extends RouterRedirectProps {
  code?: number
}

export default function Redirect(props: RedirectProps) {
  // eslint-disable-next-line react/destructuring-assignment
  const code = props.code ?? 302

  return (
    <Route
      render={({ staticContext }) => {
        if (staticContext) {
          staticContext.statusCode = code
        }
        return <RouterRedirect {...props} />
      }}
    />
  )
}
