import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import { applyMiddleware, createStore, StoreEnhancer } from 'redux'
import createSagaMiddleware from 'redux-saga'

import createRootReducer from './reducer'
import createRootSaga from './sagas'

import { defaultAlgorithmState } from './algorithm/algorithm.state'
import { triggerAlgorithm } from './algorithm/algorithm.actions'
import { defaultScenarioState } from './scenario/scenario.state'

const development = process.env.NODE_ENV === 'development'
const useReduxImmutableStateInvariant = process.env.USE_REDUX_IMMUTABLE_STATE_INVARIANT === 'development'
const debug = development || process.env.DEBUGGABLE_PROD === '1'

interface StoreParams {
  url: string
}

const storeDefaults: StoreParams = {
  url: '/',
}

export default function configureStore({ url }: StoreParams = storeDefaults) {
  const history = createBrowserHistory()

  const sagaMiddleware = createSagaMiddleware()
  const middlewares = [
    useReduxImmutableStateInvariant && require('redux-immutable-state-invariant').default(),
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

  const defaultState = {
    algorithm: defaultAlgorithmState,
    scenario: defaultScenarioState,
  }

  const store = createStore(createRootReducer(history), defaultState, enhancer)

  let rootSagaTask = sagaMiddleware.run(createRootSaga())

  store.dispatch(triggerAlgorithm())

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
