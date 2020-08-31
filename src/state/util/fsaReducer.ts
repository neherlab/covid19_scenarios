/* eslint-disable no-loops/no-loops,@typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access */

/**
 * FSA-compliant, type-safe Redux reducers.
 *
 * Adapted and extended from https://github.com/dphilipson/typescript-fsa-reducers/blob/v1.2.2/src/index.ts
 *
 * Added `.icase()` that uses immer's `produce()` and `draft`
 *
 * */

import type { Draft } from 'immer'
import produce from 'immer'

import type { Action, ActionCreator, AnyAction } from './fsaActions'

export interface ReducerBuilder<InS, OutS = InS, PassedS = InS | undefined> {
  case<P>(actionCreator: ActionCreator<P>, handler: Handler<InS, OutS, P>): ReducerBuilder<InS, OutS, PassedS>

  icase<P>(
    actionCreator: ActionCreator<P>,
    handler: (draft: Draft<InS>, payload: P) => void,
  ): ReducerBuilder<InS, OutS, PassedS>

  caseWithAction<P>(
    actionCreator: ActionCreator<P>,
    handler: Handler<InS, OutS, Action<P>>,
  ): ReducerBuilder<InS, OutS, PassedS>

  // cases variadic overloads
  cases<P1, P2>(
    actionCreators: [ActionCreator<P1>, ActionCreator<P2>],
    handler: Handler<InS, OutS, P1 | P2>,
  ): ReducerBuilder<InS, OutS, PassedS>
  cases<P1, P2, P3>(
    actionCreators: [ActionCreator<P1>, ActionCreator<P2>, ActionCreator<P3>],
    handler: Handler<InS, OutS, P1 | P2 | P3>,
  ): ReducerBuilder<InS, OutS, PassedS>
  cases<P1, P2, P3, P4>(
    actionCreators: [ActionCreator<P1>, ActionCreator<P2>, ActionCreator<P3>, ActionCreator<P4>],
    handler: Handler<InS, OutS, P1 | P2 | P3 | P4>,
  ): ReducerBuilder<InS, OutS, PassedS>
  cases<P>(actionCreators: Array<ActionCreator<P>>, handler: Handler<InS, OutS, P>): ReducerBuilder<InS, OutS, PassedS>

  // casesWithAction variadic overloads
  casesWithAction<P1, P2>(
    actionCreators: [ActionCreator<P1>, ActionCreator<P2>],
    handler: Handler<InS, OutS, Action<P1 | P2>>,
  ): ReducerBuilder<InS, OutS, PassedS>
  casesWithAction<P1, P2, P3>(
    actionCreators: [ActionCreator<P1>, ActionCreator<P2>, ActionCreator<P3>],
    handler: Handler<InS, OutS, Action<P1 | P2 | P3>>,
  ): ReducerBuilder<InS, OutS, PassedS>
  casesWithAction<P1, P2, P3, P4>(
    actionCreators: [ActionCreator<P1>, ActionCreator<P2>, ActionCreator<P3>, ActionCreator<P4>],
    handler: Handler<InS, OutS, Action<P1 | P2 | P3 | P4>>,
  ): ReducerBuilder<InS, OutS, PassedS>
  casesWithAction<P>(
    actionCreators: Array<ActionCreator<P>>,
    handler: Handler<InS, OutS, Action<P>>,
  ): ReducerBuilder<InS, OutS, PassedS>

  withHandling(
    updateBuilder: (builder: ReducerBuilder<InS, OutS, PassedS>) => ReducerBuilder<InS, OutS, PassedS>,
  ): ReducerBuilder<InS, OutS, PassedS>

  // Intentionally avoid AnyAction in return type so packages can export
  // reducers created using .default() or .build() without consumers requiring
  // a dependency on typescript-fsa.
  default(defaultHandler: Handler<InS, OutS, AnyAction>): (state: PassedS, action: { type: any }) => OutS
  build(): (state: PassedS, action: { type: any }) => OutS
  (state: PassedS, action: AnyAction): OutS
}

export type Handler<InS, OutS, P> = (state: InS, payload: P) => OutS

export function reducerWithInitialState<S>(initialState: S): ReducerBuilder<S> {
  return makeReducer<S, S, S | undefined>(initialState)
}

export function reducerWithoutInitialState<S>(): ReducerBuilder<S, S, S> {
  return makeReducer<S, S, S>()
}

export function upcastingReducer<InS extends OutS, OutS>(): ReducerBuilder<InS, OutS, InS> {
  return makeReducer<InS, OutS, InS>()
}

export default function immerCase<StateType, PayloadType>(
  actionCreator: ActionCreator<PayloadType>,
  handler: (draft: Draft<StateType>, payload: PayloadType) => void,
) {
  return (reducer: ReducerBuilder<StateType>) =>
    reducer.case(actionCreator, (state, payload) => produce(state, (draft) => handler(draft, payload)))
}

function makeReducer<InS, OutS, PassedS>(initialState?: InS): ReducerBuilder<InS, OutS, PassedS> {
  const handlersByActionType: {
    [actionType: string]: Handler<InS, OutS, any>
  } = {}
  const reducer = getReducerFunction(initialState, handlersByActionType) as ReducerBuilder<InS, OutS, PassedS>

  reducer.caseWithAction = <P>(actionCreator: ActionCreator<P>, handler: Handler<InS, OutS, Action<P>>) => {
    handlersByActionType[actionCreator.type] = handler
    return reducer
  }

  reducer.case = <P>(actionCreator: ActionCreator<P>, handler: Handler<InS, OutS, P>) =>
    reducer.caseWithAction(actionCreator, (state, action) => handler(state, action.payload))

  reducer.icase = <P>(actionCreator: ActionCreator<P>, handler: (draft: Draft<InS>, payload: P) => void) => {
    return reducer.caseWithAction(
      actionCreator,
      (state: InS, action) => produce(state, (draft: Draft<InS>) => handler(draft, action.payload) as unknown) as OutS,
    )
  }

  reducer.casesWithAction = <P>(actionCreators: Array<ActionCreator<P>>, handler: Handler<InS, OutS, Action<P>>) => {
    for (const actionCreator of actionCreators) {
      reducer.caseWithAction(actionCreator, handler)
    }
    return reducer
  }

  reducer.cases = <P>(actionCreators: Array<ActionCreator<P>>, handler: Handler<InS, OutS, P>) =>
    reducer.casesWithAction(actionCreators, (state, action) => handler(state, action.payload))

  reducer.withHandling = (
    updateBuilder: (builder: ReducerBuilder<InS, OutS, PassedS>) => ReducerBuilder<InS, OutS, PassedS>,
  ) => updateBuilder(reducer)

  reducer.default = (defaultHandler: Handler<InS, OutS, AnyAction>) =>
    getReducerFunction<InS, OutS, PassedS>(initialState, { ...handlersByActionType }, defaultHandler)

  reducer.build = () => getReducerFunction(initialState, { ...handlersByActionType })

  return reducer
}

function getReducerFunction<InS, OutS, PassedS>(
  initialState: InS | undefined,
  handlersByActionType: { [actionType: string]: Handler<InS, OutS, any> },
  defaultHandler?: Handler<InS, OutS, AnyAction>,
) {
  return (passedState: PassedS, action: AnyAction) => {
    const state = passedState !== undefined ? passedState : initialState
    const handler = handlersByActionType[action.type] || defaultHandler
    return handler ? handler(state as InS, action) : ((state as unknown) as OutS)
  }
}
