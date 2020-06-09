import 'regenerator-runtime'

import 'map.prototype.tojson' // to visualize Map in Redux Dev Tools
import 'set.prototype.tojson' // to visualize Set in Redux Dev Tools
import './helpers/errorPrototypeTojson' // to visualize Error in Redux Dev Tools

import 'react-dates/initialize'

import { enableES5 } from 'immer'

import React, { Suspense } from 'react'
import { render } from 'react-dom'

import { I18nextProvider } from 'react-i18next'
import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { MDXProvider } from '@mdx-js/react'

import LinkExternal from './components/Router/LinkExternal'

import App from './components/App'

import { initialize } from './initialize'

enableES5()

initialize()
  .then(({ store, history, persistor, i18n }) => {
    const Root = (
      <Suspense fallback="loading">
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <MDXProvider components={{ a: LinkExternal }}>
              <PersistGate loading={null} persistor={persistor}>
                <I18nextProvider i18n={i18n}>
                  <App />
                </I18nextProvider>
              </PersistGate>
            </MDXProvider>
          </ConnectedRouter>
        </Provider>
      </Suspense>
    )

    return render(Root, document.getElementById('root'))
  })
  .catch(console.error)
