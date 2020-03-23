import i18next from 'i18next'
export interface OverallScenario {
  name: string
  containmentScenario: string
  epidemiologicalScenario: string
  populationScenario: string
}

const globalScenarios: OverallScenario[] = [
  {
    name: i18next.t('Default'),
    containmentScenario: i18next.t('Moderate mitigation'),
    epidemiologicalScenario: i18next.t('Moderate/North'),
    populationScenario: 'CHE-Basel-Stadt',
  },
  {
    name: `${i18next.t('Country')} - ${i18next.t('No mitigation')}`,
    containmentScenario: i18next.t('No mitigation'),
    epidemiologicalScenario: i18next.t('Moderate/North'),
    populationScenario: 'Germany',
  },
  {
    name: `${i18next.t('City')} - ${i18next.t('strong mitigation')}`,
    containmentScenario: i18next.t('Strong mitigation'),
    epidemiologicalScenario: i18next.t('Moderate/North'),
    populationScenario: 'SWE-Stockholm',
  },
]

export default globalScenarios
