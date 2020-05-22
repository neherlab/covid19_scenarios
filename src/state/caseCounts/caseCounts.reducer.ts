import { reducerWithInitialState } from 'typescript-fsa-reducers'

import immerCase from '../util/fsaImmerReducer'

import { setCaseCountsData } from './caseCounts.actions'

import { defaultCaseCountsState } from './caseCounts.state'

export const caseCountsReducer = reducerWithInitialState(defaultCaseCountsState) // prettier-ignore
  .withHandling(
    immerCase(setCaseCountsData, (draft, { data }) => {
      draft.caseCountsData = data
    }),
  )
