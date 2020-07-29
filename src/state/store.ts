import { format } from 'url'

import type { Router } from 'next/router'
import { applyMiddleware, createStore, StoreEnhancer, Store, Middleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import type { PersistorOptions, Persistor } from 'redux-persist/es/types'
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant'
import createSagaMiddleware from 'redux-saga'
import { createRouterMiddleware, initialRouterState } from 'connected-next-router'
import { persistStore } from 'redux-persist'
import { createLogger } from 'redux-logger'

import { createRootReducer } from './reducer'
import { createRootSaga } from './sagas'

export function persistStoreAsync(store: Store, options: PersistorOptions): Promise<Persistor> {
  return new Promise((resolve) => {
    const persistor = persistStore(store, options, () => resolve(persistor))
  })
}

export interface ConfigureStoreParams {
  router: Router
}

export async function configureStore({ router }: ConfigureStoreParams) {
  const routerMiddleware = createRouterMiddleware()
  const sagaMiddleware = createSagaMiddleware()

  let middlewares: Middleware<string>[] = [routerMiddleware, sagaMiddleware].filter(Boolean)

  if (process.env.ENABLE_REDUX_IMMUTABLE_STATE_INVARIANT === 'true') {
    middlewares = [...middlewares, reduxImmutableStateInvariant() as Middleware<string>]
  }

  if (process.env.ENABLE_REDUX_LOGGER === 'true') {
    const logger = createLogger({})
    middlewares = [...middlewares, logger]
  }

  let enhancer = applyMiddleware(...middlewares)

  if (process.env.ENABLE_REDUX_DEV_TOOLS === 'true' && composeWithDevTools) {
    enhancer = composeWithDevTools({
      // trace: true,
      // traceLimit: 25,
      actionsBlacklist: '@@INIT',
    })(enhancer)
  }

  const { asPath, pathname, query } = router
  let initialState
  if (asPath) {
    const url = format({ pathname, query })
    initialState = {
      router: initialRouterState(url, asPath),
    }
  }

  const store = createStore(createRootReducer(), initialState, enhancer)
  const persistor = await persistStoreAsync(store, {})

  let rootSagaTask = sagaMiddleware.run(createRootSaga())

  if (module.hot) {
    // Setup hot reloading of root reducer
    module.hot.accept('./reducer', () => {
      store.replaceReducer(createRootReducer())
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

  return { store, persistor }
}

declare const window: Window & {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: StoreEnhancer
}

declare const module: NodeHotModule
