import { AxiosResponse } from 'axios'
import { SagaIterator } from 'redux-saga'
import { call, cancelled, put } from 'redux-saga/effects'
import { Action, AsyncActionCreators } from 'typescript-fsa'

/**
 * Produces a saga that wraps an original worker saga, into a common usage
 * pattern typical for asynchronous operations, with FSA-compliant actions.
 *
 * @description Accepts a saga ("worker") and a `typescript-fsa`
 * "asynchronous action creators" object (containing action creators 'started',
 * 'done' and 'failed', each adhering to FSA standard)
 * and produces another saga which organizes actions around the worker
 * call. Before running the worker, our wrapper will first dispatch the
 * 'started' action. If worker yields a successful result, then 'done'
 * action is dispatched. Otherwise (if worker fails or cancelled), 'failed'
 * action is dispatched.
 *
 * TODO: make it more type-safe: replace `any` with strict types,
 *  add explicit return types
 *
 * @see https://github.com/redux-utilities/flux-standard-action
 *
 * @param asyncActionCreators
 * @param worker
 */
export default function fsaSaga<Params, Result>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  asyncActionCreators: AsyncActionCreators<Params, Result, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  worker: (params: Params) => any,
) {
  return function* wrappedSaga(action: Action<Params>): SagaIterator {
    const params = action.payload

    // Dispatch "started" action
    yield put(asyncActionCreators.started(params))

    try {
      // Call worker
      const response: AxiosResponse<{ payload: Result }> = yield call(worker, params)
      const result: Result = response.data.payload

      // We are still here? All good, dispatch "done" action with results
      yield put(asyncActionCreators.done({ params, result }))
    } catch (error) {
      // Worker has failed. Dispatch "failed" action with the error.
      yield put(
        asyncActionCreators.failed({
          params,
          error: { error: error.message },
        }),
      )
    } finally {
      // Check if the saga was cancelled (e.g. manually or as a result of take*)
      if (yield cancelled()) {
        // If it was, dispatch "failed" action with the special error value.
        yield put(asyncActionCreators.failed({ params, error: { error: 'cancelled' } }))
      }
    }
  }
}
