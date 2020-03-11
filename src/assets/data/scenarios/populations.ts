import { PopulationData } from '../../../algorithms/Param.types'

interface PopulationScenario {
  name: string
  data: PopulationData
}

const populationScenarios: PopulationScenario[] = [
  {
    name: 'Stockholm',
    data: {
      populationServed: 1000000,
      country: 'Sweden',
      suspectedCasesToday: 250,
      importsPerDay: 1.5,
    },
  },
  {
    name: 'Basel',

    data: {
      populationServed: 200000,
      country: 'Switzerland',
      suspectedCasesToday: 100,
      importsPerDay: 0.5,
    },
  },
]

export default populationScenarios
