import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import { applyMiddleware, createStore, StoreEnhancer } from 'redux'
import createSagaMiddleware from 'redux-saga'

import createRootReducer from './reducer'
import createRootSaga from './sagas'

const development = process.env.NODE_ENV === 'development'
const debug = development || process.env.DEBUGGABLE_PROD === '1'

interface StoreParams {
  location: Location
}

const storeDefaults: StoreParams = {
  location: window?.location ?? { pathname: '/' },
}

export default function configureStore({ location = storeDefaults.location }: StoreParams = storeDefaults) {
  const history = createBrowserHistory()
  history.push(location)

  const sagaMiddleware = createSagaMiddleware()
  const middlewares = [
    process.env.DEV_ENABLE_REDUX_IMMUTABLE_STATE_INVARIANT === '1' &&
      require('redux-immutable-state-invariant').default(),
    routerMiddleware(history),
    sagaMiddleware,
  ].filter(Boolean)

  let enhancer = applyMiddleware(...middlewares)
  const devToolsCompose = require('redux-devtools-extension').composeWithDevTools

  if (debug && devToolsCompose) {
    enhancer = devToolsCompose({
      trace: true,
      traceLimit: 25,
      actionsBlacklist: '@@INIT',
    })(enhancer)
  }

  const store = createStore(createRootReducer(history), {}, enhancer)

  let rootSagaTask = sagaMiddleware.run(createRootSaga())

  if (module.hot) {
    // Setup hot reloading of root reducer
    module.hot.accept('./reducer', () => {
      store.replaceReducer(createRootReducer(history))
      console.info('[HMR] root reducer reloaded succesfully')
    })

    // Setup hot reloading of root saga
    module.hot.accept('./sagas', () => {
      rootSagaTask.cancel()
      rootSagaTask
        .toPromise()
        .then(() => {
          rootSagaTask = sagaMiddleware.run(createRootSaga())
          console.info('[HMR] root saga reloaded succesfully')
          return true
        })
        .catch((error: Error) => console.error(error))
    })
  }

  return { store, history }
}

declare const window: Window & {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: StoreEnhancer
}

declare const module: NodeHotModule
