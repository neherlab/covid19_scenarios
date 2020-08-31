/* eslint-disable @typescript-eslint/no-explicit-any,prefer-object-spread */

/**
 * FSA-compliant, type-safe Redux actions.
 *
 * Adapted and extended from https://github.com/aikoven/typescript-fsa/blob/v3.0.0/src/index.ts
 *
 * Added `.trigger` and `.cancelled` action creators to async action creators.
 * This is convenient for using with redux-saga.
 *
 */

export interface AnyAction {
  type: any
}

export type Meta = null | { [key: string]: any }

export interface Action<Payload> extends AnyAction {
  type: string
  payload: Payload
  error?: boolean
  meta?: Meta
}

export function isType<Payload>(action: AnyAction, actionCreator: ActionCreator<Payload>): action is Action<Payload> {
  return action.type === actionCreator.type
}

export interface ActionCreator<Payload> {
  type: string
  match: (action: AnyAction) => action is Action<Payload>
  (payload: Payload, meta?: Meta): Action<Payload>
}

export type Success<Params, Result> = ({ params: Params } | (Params extends void ? { params?: Params } : never)) &
  ({ result: Result } | (Result extends void ? { result?: Result } : never))

export type Failure<Params, Error> = ({ params: Params } | (Params extends void ? { params?: Params } : never)) & {
  error: Error
}

export type Cancellation<Params> = ({ params: Params } | (Params extends void ? { params?: Params } : never)) & {
  error: Error
}

export interface AsyncActionCreators<Params, Result, Error = Record<string, unknown>> {
  type: string
  trigger: ActionCreator<Params>
  started: ActionCreator<Params>
  done: ActionCreator<Success<Params, Result>>
  failed: ActionCreator<Failure<Params, Error>>
  cancelled: ActionCreator<Cancellation<Params>>
}

export interface ActionCreatorFactory {
  <Payload = void>(type: string, commonMeta?: Meta, isError?: boolean): ActionCreator<Payload>
  <Payload = void>(type: string, commonMeta?: Meta, isError?: (payload: Payload) => boolean): ActionCreator<Payload>
  async<Params, Result, Error = Record<string, unknown>>(
    type: string,
    commonMeta?: Meta,
  ): AsyncActionCreators<Params, Result, Error>
}

declare const process: {
  env: {
    NODE_ENV?: string
  }
}

export function actionCreatorFactory(
  prefix?: string | null,
  defaultIsError: (payload: any) => boolean = (p) => p instanceof Error,
): ActionCreatorFactory {
  const actionTypes: { [type: string]: boolean } = {}

  const base = prefix ? `${prefix}/` : ''

  function actionCreator<Payload>(
    type: string,
    commonMeta?: Meta,
    isError: ((payload: Payload) => boolean) | boolean = defaultIsError,
  ) {
    const fullType = base + type

    if (process.env.NODE_ENV !== 'production') {
      if (actionTypes[fullType]) throw new Error(`Duplicate action type: ${fullType}`)

      actionTypes[fullType] = true
    }

    return Object.assign(
      (payload: Payload, meta?: Meta) => {
        const action: Action<Payload> = {
          type: fullType,
          payload,
        }

        if (commonMeta || meta) {
          action.meta = Object.assign({}, commonMeta, meta)
        }

        if (isError && (typeof isError === 'boolean' || isError(payload))) {
          action.error = true
        }

        return action
      },
      {
        type: fullType,
        toString: () => fullType,
        match: (action: AnyAction): action is Action<Payload> => action.type === fullType,
      },
    ) as ActionCreator<Payload>
  }

  function asyncActionCreators<Params, Result, Error>(
    type: string,
    commonMeta?: Meta,
  ): AsyncActionCreators<Params, Result, Error> {
    return {
      type: base + type,
      trigger: actionCreator(`${type}.trigger`, commonMeta, false),
      started: actionCreator<Params>(`${type}.started`, commonMeta, false),
      done: actionCreator<Success<Params, Result>>(`${type}.done`, commonMeta, false),
      failed: actionCreator<Failure<Params, Error>>(`${type}.failed`, commonMeta, true),
      cancelled: actionCreator<Cancellation<Params>>(`${type}.cancelled`, commonMeta, false),
    }
  }

  return Object.assign(actionCreator, { async: asyncActionCreators })
}

export default actionCreatorFactory
