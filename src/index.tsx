import 'regenerator-runtime'

import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'

import React from 'react'
import { render } from 'react-dom'

import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'

import App from './components/App'

import configureStore from './state/store'

const { store, history } = configureStore()
const Root = (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>
)

render(Root, document.getElementById('root'))
