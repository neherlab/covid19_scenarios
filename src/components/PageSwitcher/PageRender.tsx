import React from 'react'

import Loadable from './Loadable'

interface PageRenderParams {
  page: string
  loadingComponent: JSX.Element
  forceLoadingMs: number
  timeoutMs: number
}

interface PageProps {
  match: { path: string; params: object }
}

function pageRender({ page, loadingComponent, forceLoadingMs, timeoutMs }: PageRenderParams) {
  function Page(props: PageProps) {
    const {
      match: { path: pathname, params },
    } = props

    return (
      <Loadable
        page={page}
        pathname={pathname}
        fallback={loadingComponent}
        forceLoadingMs={forceLoadingMs}
        timeoutMs={timeoutMs}
        {...params}
      />
    )
  }
  return Page
}

export default pageRender
