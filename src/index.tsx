import 'regenerator-runtime'

import 'map.prototype.tojson' // to visualize Map in Redux Dev Tools
import 'set.prototype.tojson' // to visualize Set in Redux Dev Tools
import './helpers/errorPrototypeTojson' // to visualize Error in Redux Dev Tools

import 'react-dates/initialize'

import { PersistGate } from 'redux-persist/integration/react'
import { enableES5 } from 'immer'

import React, { Suspense } from 'react'
import { render } from 'react-dom'

import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'
import { MDXProvider } from '@mdx-js/react'

import LinkExternal from './components/Router/LinkExternal'

import App from './components/App'

import { configureStore } from './state/store'
import { initialize } from './initialize'

enableES5()

configureStore()
  .then(({ store, history, persistor }) => {
    initialize({ store })
    return { store, history, persistor }
  })
  .then(({ store, history, persistor }) => {
    const Root = (
      <Suspense fallback="loading">
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <MDXProvider components={{ a: LinkExternal }}>
              <PersistGate loading={null} persistor={persistor}>
                <App />
              </PersistGate>
            </MDXProvider>
          </ConnectedRouter>
        </Provider>
      </Suspense>
    )

    return render(Root, document.getElementById('root'))
  })
  .catch(console.error)
