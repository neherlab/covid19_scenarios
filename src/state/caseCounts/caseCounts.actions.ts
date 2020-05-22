import actionCreatorFactory from 'typescript-fsa'

import type { CaseCountsData } from '../../algorithms/types/Param.types'

const action = actionCreatorFactory('CASE_COUNTS')

export interface SetCaseCountsData {
  data: CaseCountsData
}

export const setCaseCountsData = action<SetCaseCountsData>('SET_CASE_COUNTS_DATA')
