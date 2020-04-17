import 'regenerator-runtime'

import 'map.prototype.tojson' // to visualize Map in Redux Dev Tools
import 'set.prototype.tojson' // to visualize Set in Redux Dev Tools

import 'react-dates/initialize'

import { enableMapSet } from 'immer'

import React from 'react'
import { render } from 'react-dom'

import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'
import { MDXProvider } from '@mdx-js/react'
import LinkExternal from './components/Router/LinkExternal'

import './i18n'

import App from './components/App'

import configureStore from './state/store'

enableMapSet()

const { store, history } = configureStore()
const Root = (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <MDXProvider components={{ a: LinkExternal }}>
        <App />
      </MDXProvider>
    </ConnectedRouter>
  </Provider>
)

render(Root, document.getElementById('root'))
