import { expectSaga, testSaga } from 'redux-saga-test-plan'
import { call, takeLatest } from 'redux-saga/effects'
import actionCreatorFactory from 'typescript-fsa'

import fsaSaga from '../fsaSaga'

interface Params {
  cargo: string
}

interface Result {
  message: string
}

interface Errors {
  error: string
}

const action = actionCreatorFactory('FSA_TEST')

const trigger = action<Params>('TRIGGER')

const reply = action.async<Params, Result, Errors>('REPLY')

async function api(cargo: string) {
  return Promise.resolve({ message: `all good, got ${cargo}` })
}

function* worker({ cargo }: Params) {
  const result: Result = yield call(api, cargo)
  return { result }
}

describe('FSA saga wrapper', () => {
  it('should dispatch "started", then yield call worker, then dispatch "done", then yield "cancelled" effect on success (in this order)', async () => {
    // In normal run scenario we expect "started" and "done" actions to surround
    // the worker call
    const params: Params = { cargo: 'stuff' }
    const result: Result = { message: 'all good, got stuff' }
    const replyStarted = reply.started(params)
    const replyDone = reply.done({ params, result })

    return testSaga(fsaSaga(reply, worker), trigger(params))
      .next()
      .put(replyStarted)

      .next(replyStarted)
      .call(worker, params)

      .next(result)
      .put(replyDone)

      .next()
      .cancelled()

      .next()
      .isDone()
  })

  it('should dispatch "started", then yield call worker, then dispatch "failed", then yield "cancelled" effect on failure (in this order)', async () => {
    // In scenario where the worker throws an exception we except the `failed`
    // action to be dispatched instead of `done`
    const error = new Error('throw stuff')
    const params: Params = { cargo: 'stuff' }
    const errors: Errors = { error: error.message }
    const replyStarted = reply.started(params)
    const replyFailed = reply.failed({ params, error: errors })

    return testSaga(fsaSaga(reply, worker), trigger(params))
      .next()
      .put(replyStarted)

      .next(replyStarted)
      .call(worker, params)

      .next()
      .throw(error)
      .put(replyFailed)

      .next()
      .cancelled()

      .next()
      .isDone()
  })

  it('should handle cancellation by dispatching "failed"', async () => {
    // Wrapping saga in `takeLatest` and dispatching two triggers in quick
    // succession should result in first reply being cancelled
    const paramsFirst: Params = { cargo: 'first' }
    const paramsSecond: Params = { cargo: 'second' }
    const error: Errors = { error: 'cancelled' }
    const firstCancelled = reply.failed({ params: paramsFirst, error })

    function* cancellableSaga() {
      yield takeLatest(trigger, fsaSaga(reply, worker))
    }

    return expectSaga(cancellableSaga)
      .put(firstCancelled)
      .dispatch(trigger(paramsFirst))
      .dispatch(trigger(paramsSecond))
      .run({ silenceTimeout: true })
  })
})
