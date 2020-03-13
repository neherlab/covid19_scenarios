import produce, { Draft } from 'immer'
import { ActionCreator } from 'typescript-fsa'
import { ReducerBuilder } from 'typescript-fsa-reducers'

// https://github.com/dphilipson/typescript-fsa-reducers/issues/30
export default function immerCase<StateType, PayloadType>(
  actionCreator: ActionCreator<PayloadType>,
  handler: (draft: Draft<StateType>, payload: PayloadType) => void,
): (reducer: ReducerBuilder<StateType>) => ReducerBuilder<StateType> {
  return reducer => reducer.case(actionCreator, (state, payload) => produce(state, draft => handler(draft, payload)))
}
