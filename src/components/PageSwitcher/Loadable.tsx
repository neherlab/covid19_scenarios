import loadable from '@loadable/component'
import delay from 'p-min-delay'
import { timeout } from 'promise-timeout'
import { withErrorBoundary } from 'react-error-boundary'

import ErrorPage from '../../pages/ErrorPage'

export interface LoadableProps {
  page: string
  pathname: string
  forceLoadingMs: number
  timeoutMs: number
}

const Loadable = loadable((props: LoadableProps) => {
  const { forceLoadingMs, timeoutMs } = props

  let pagePromise = import(
    /* webpackMode: "lazy" */
    /* webpackChunkName: "pages/[request]" */
    /* webpackExclude: /(\.(css|scss)|(\/__tests__\/.*|([.\/])(test|spec))\.(js|ts\md)sx?)$/ */
    `../../pages/${props.page}`
  )

  // Force "Loading" component to be shown a given amount of time
  // (even if main component loads before the time elapses)
  // Useful for transition animations.
  if (forceLoadingMs > 0) {
    pagePromise = delay(pagePromise, forceLoadingMs)
  }

  // Emit error if page fails to load withing given time interval
  if (timeoutMs > 0) {
    pagePromise = timeout(pagePromise, timeoutMs)
  }

  return pagePromise
})

export default withErrorBoundary(Loadable, ErrorPage)
