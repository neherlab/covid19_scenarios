import { AllParams, AgeDistribution } from '../../../../../algorithms/types/Param.types'

// part of the application state to be persisted in the URL
export interface PersistedState {
  current: string
  data: AllParams
  ageDistribution: AgeDistribution
}
