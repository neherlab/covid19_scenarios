import { PopulationData } from '../../../algorithms/Param.types'
import populationDataPreset from '../population.json'

interface PopulationScenario {
  name: string
  data: PopulationData
}

const populationScenarios: PopulationScenario[] = populationDataPreset

export default populationScenarios
