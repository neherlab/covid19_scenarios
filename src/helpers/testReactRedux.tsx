/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react'

import { Provider } from 'react-redux'
import { createStore, Store } from 'redux'

import { createRootReducer, State } from 'src/state/reducer'

import { render as rtlRender, RenderOptions } from '@testing-library/react'
import { DeepPartial } from 'ts-essentials'
import { ConnectedRouter } from 'connected-next-router'
import { ThemeProvider } from 'styled-components'
import { theme } from 'src/theme'
import { MDXProvider } from '@mdx-js/react'
import { LinkExternal } from 'src/components/Link/LinkExternal'

export interface ReduxRenderOptions extends RenderOptions {
  initialState?: DeepPartial<State>
  store?: Store
}

export function render(
  component: React.ReactElement,
  { initialState, store, ...renderOptions }: ReduxRenderOptions = {},
) {
  // @ts-ignore
  const newStore = store ?? createStore(createRootReducer(), initialState)

  function Wrapper({ children }: React.PropsWithChildren<unknown>) {
    return (
      <Provider store={newStore}>
        <ConnectedRouter>
          <ThemeProvider theme={theme}>
            <MDXProvider components={{ a: LinkExternal }}>{children}</MDXProvider>
          </ThemeProvider>
        </ConnectedRouter>
      </Provider>
    )
  }
  return rtlRender(component, { wrapper: Wrapper, ...renderOptions })
}
