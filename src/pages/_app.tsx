import 'map.prototype.tojson' // to visualize Map in Redux Dev Tools
import 'set.prototype.tojson' // to visualize Set in Redux Dev Tools
import '../helpers/errorPrototypeTojson' // to visualize Error in Redux Dev Tools

import 'react-dates/initialize'

import { enableES5 } from 'immer'

import React, { Suspense, useEffect, useState } from 'react'

import NextApp, { AppInitialProps, AppContext, AppProps } from 'next/app'
import type { History } from 'history'
import type { Persistor } from 'redux-persist'
import type { Store } from 'redux'
import type { i18n } from 'i18next'

import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { ConnectedRouter } from 'connected-react-router'
import { PersistGate } from 'redux-persist/integration/react'
import { MDXProvider } from '@mdx-js/react'

import Loading from '../components/PageSwitcher/Loading'

import LinkExternal from '../components/Router/LinkExternal'

import { initialize } from '../initialize'

import '../styles/global.scss'

enableES5()

export interface AppState {
  persistor: Persistor
  history: History
  store: Store
  i18n: i18n
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const [state, setState] = useState<AppState | undefined>()

  useEffect(() => {
    initialize()
      .then(setState)
      .catch((error) => {
        throw error
      })
  }, [])

  if (!state) {
    return null
  }

  const { store, history, persistor, i18n } = state

  return (
    <Suspense fallback={<Loading />}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <MDXProvider components={{ a: LinkExternal }}>
            <PersistGate loading={null} persistor={persistor}>
              <I18nextProvider i18n={i18n}>
                <Component {...pageProps} />
              </I18nextProvider>
            </PersistGate>
          </MDXProvider>
        </ConnectedRouter>
      </Provider>
    </Suspense>
  )
}

MyApp.getInitialProps = async (appContext: AppContext): Promise<AppInitialProps> => {
  return NextApp.getInitialProps(appContext)
}
