import 'regenerator-runtime'

import 'react-dates/initialize'

import React from 'react'
import { render } from 'react-dom'

import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'

import './i18n'

import { init as initCloudProvider } from './helpers/cloudStorage'

import App from './components/App'

import configureStore from './state/store'

// TODO Rename
initCloudProvider()

const { store, history } = configureStore()
const Root = (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>
)

render(Root, document.getElementById('root'))
