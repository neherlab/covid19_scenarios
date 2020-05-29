import { reducerWithInitialState } from 'typescript-fsa-reducers'

import immerCase from '../util/fsaImmerReducer'

import { setLocale } from './ui.actions'
import { uiDefaultState } from './ui.state'

export const uiReducer = reducerWithInitialState(uiDefaultState) // prettier-ignore
  .withHandling(
    immerCase(setLocale, (draft, locale) => {
      draft.locale = locale
    }),
  )
