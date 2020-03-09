export interface GlobalScenario {
  name: string
  containmentScenario: string
  epidemiologicalScenario: string
  populationScenario: string
}

const globalScenarios: GlobalScenario[] = [
  {
    name: 'Default',
    containmentScenario: 'Moderate Reduction',
    epidemiologicalScenario: 'Moderate Northern',
    populationScenario: 'Basel',
  },
  {
    name: 'Extreme',
    containmentScenario: 'No Reduction',
    epidemiologicalScenario: 'Moderate Tropical',
    populationScenario: 'Stockholm',
  },
]

export default globalScenarios
