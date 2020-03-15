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
      hospitalBeds:1000,
      ICUBeds:80
    },
  },
  {
    name: 'Stockholm',
    data: {
      populationServed: 2000000,
      country: 'Sweden',
      suspectedCasesToday: 500,
      importsPerDay: 2,
      hospitalBeds:10000,
      ICUBeds:800
    },
  },
  {
    name: 'Switzerland',
    data: {
      populationServed: 8600000,
      country: 'Switzerland',
      suspectedCasesToday: 1000,
      importsPerDay: 5,
      hospitalBeds: 38000,
      ICUBeds: 1400
    },
  },
  {
    name: 'Germany',
    data: {
      populationServed: 80000000,
      country: 'Germany',
      suspectedCasesToday: 10000,
      importsPerDay: 10,
      hospitalBeds: 640000,
      ICUBeds: 28000
    },
  },
  {
    name: 'USA',
    data: {
      populationServed: 330000000,
      country: 'United States of America',
      suspectedCasesToday: 100000,
      importsPerDay: 50,
      hospitalBeds: 1000000,
      ICUBeds: 100000
    },
  },
]

export default populationScenarios
