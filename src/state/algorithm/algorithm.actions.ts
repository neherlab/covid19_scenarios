import actionCreatorFactory from 'typescript-fsa'

import type { CaseCountsData } from '../../algorithms/types/Param.types'

const action = actionCreatorFactory('ALGORITHM')

export interface SetCaseCountsData {
  data: CaseCountsData
}

export const algorithmRunTrigger = action('RUN_TRIGGER')

export const algorithmRunAsync = action.async('RUN')
