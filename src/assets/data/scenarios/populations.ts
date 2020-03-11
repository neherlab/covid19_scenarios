import { PopulationData } from '../../../algorithms/Param.types'

interface PopulationScenario {
  name: string
  data: PopulationData
}

const populationScenarios: PopulationScenario[] = [
  {
    name: 'Basel',
    data: {
      populationServed: 200000,
      country: 'Switzerland',
      suspectedCasesToday: 100,
      importsPerDay: 0.5,
    },
  },
  {
    name: 'Stockholm',
    data: {
      populationServed: 2000000,
      country: 'Sweden',
      suspectedCasesToday: 500,
      importsPerDay: 2,
    },
  },
  {
    name: 'Switzerland',
    data: {
      populationServed: 8600000,
      country: 'Switzerland',
      suspectedCasesToday: 1000,
      importsPerDay: 5,
    },
  },
  {
    name: 'Germany',
    data: {
      populationServed: 80000000,
      country: 'Germany',
      suspectedCasesToday: 10000,
      importsPerDay: 10,
    },
  },
  {
    name: 'USA',
    data: {
      populationServed: 400000000,
      country: 'United States of America',
      suspectedCasesToday: 100000,
      importsPerDay: 50,
    },
  },
]

export default populationScenarios
