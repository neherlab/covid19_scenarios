import { ScenarioData } from '../../../../../algorithms/types/Param.types'
import { OneCountryAgeDistribution } from '../../../../../assets/data/CountryAgeDistribution.types'

// part of the application state to be persisted in the URL
export interface PersistedState {
  current: string
  data: ScenarioData
  ageDistribution: OneCountryAgeDistribution
}
