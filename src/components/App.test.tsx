import React from 'react'
import ReactDOM from 'react-dom'

import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'

import configureStore from '../state/store'

import App from './App'

test('App renders without crashing', () => {
  const div = document.createElement('div')

  const { store, history } = configureStore()

  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>,
    div,
  )

  expect(Object.keys(div).length).toBeGreaterThan(0)
})
