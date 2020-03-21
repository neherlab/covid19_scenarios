export interface OverallScenario {
  name: string
  containmentScenario: string
  epidemiologicalScenario: string
  populationScenario: string
}

const globalScenarios: OverallScenario[] = [
  {
    name: 'Default',
    containmentScenario: 'Moderate mitigation',
    epidemiologicalScenario: 'Moderate/North',
    populationScenario: 'CHE-Basel-Stadt',
  },
  {
    name: 'Country - no mitigation',
    containmentScenario: 'No mitigation',
    epidemiologicalScenario: 'Moderate/North',
    populationScenario: 'Germany',
  },
  {
    name: 'City - strong mitigation',
    containmentScenario: 'Strong mitigation',
    epidemiologicalScenario: 'Moderate/North',
    populationScenario: 'SWE-Stockholm',
  },
]

export default globalScenarios
