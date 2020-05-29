import { State } from '../reducer'

export const selectCaseCountsData = (state: State) => state.caseCounts.caseCountsData?.data
