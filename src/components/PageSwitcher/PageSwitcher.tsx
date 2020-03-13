import React from 'react'

import { Location } from 'history'
import { Route, Switch } from 'react-router'

import NotFound from '../../pages/NotFound'
import pageRender from './PageRender'

export interface PageRouteDesc {
  path: string
  page: string
}

export interface PageSwitcherProps {
  location: Location
  routes: PageRouteDesc[]
  loadingComponent: JSX.Element
  forceLoadingMs?: number
  timeoutMs?: number
}

// Switches between routes that render dynamically loaded pages from the list.
const PageSwitcher: React.FC<PageSwitcherProps> = ({
  location,
  routes,
  loadingComponent,
  forceLoadingMs = 100,
  timeoutMs = 20000,
}) => (
  <Switch location={location}>
    {[
      ...routes.map(({ path, page }: PageRouteDesc) => {
        const render = pageRender({
          page,
          timeoutMs,
          loadingComponent,
          forceLoadingMs,
        })

        return <Route exact={!path.includes(':')} path={path} key={path} render={render} />
      }),

      // The last "catch-all" entry defaults to "NotFound" page
      <Route exact key="notfound" component={NotFound} />,
    ]}
  </Switch>
)

export default PageSwitcher
