import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory, createMemoryHistory } from 'history'
import { applyMiddleware, createStore, StoreEnhancer, Store } from 'redux'
import { PersistorOptions, Persistor } from 'redux-persist/es/types'
import createSagaMiddleware from 'redux-saga'

import { persistStore } from 'redux-persist'

import createRootReducer from './reducer'
import createRootSaga from './sagas'

const development = process.env.NODE_ENV === 'development'
const debug = development || process.env.DEBUGGABLE_PROD === '1'

export function persistStoreAsync(store: Store, options: PersistorOptions): Promise<Persistor> {
  return new Promise((resolve) => {
    const persistor = persistStore(store, options, () => resolve(persistor))
  })
}

export async function configureStore() {
  const history = typeof window === 'undefined' ? createMemoryHistory() : createBrowserHistory()

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
  const persistor = await persistStoreAsync(store, {})

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

  return { store, history, persistor }
}

declare const window: Window & {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: StoreEnhancer
}

declare const module: NodeHotModule
