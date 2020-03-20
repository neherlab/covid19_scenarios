import { AllParamsFlat } from './Param.types'

import countryAgeDistribution from '../assets/data/country_age_distribution.json'
import countryCaseCounts from '../assets/data/case_counts.json'
import severityData from '../assets/data/severityData.json'
import populationScenarios from '../assets/data/scenarios/populations'
import epidemiologicalScenarios from '../assets/data/scenarios/epidemiological'
import simulationData from '../assets/data/scenarios/simulation'
import containmentScenarios from '../assets/data/scenarios/containment'

import run from './run'

const defaultParams: AllParamsFlat = {
  ...populationScenarios[0].data,
  ...epidemiologicalScenarios[1].data,
  ...simulationData,
}

describe('run()', () => {
  it('should return hello world', async () => {
    const result = await run(
      defaultParams,
      severityData,
      countryAgeDistribution.Germany,
      containmentScenarios[0].data.reduction,
    )
    expect(result).toBeObject()
  })

  it('should work for all r0', async () => {
    // Override r0 for this test
    const params = { ...defaultParams, r0: 0.85 }

    const result = await run(
      params,
      severityData,
      countryAgeDistribution.Germany,
      containmentScenarios[0].data.reduction,
    )
    expect(result).toBeObject()
  })

  it('should work for a lot of countries', async () => {
    const countries = [
      'Switzerland',
      'Germany',
      'France',
      'Italy',
      'Spain',
      'Poland',
      'Romania',
      'Netherlands',
      'Belgium',
      'Czechia',
      'Greece',
      'Portugal',
      'Sweden',
      'Hungary',
      'Austria',
      'Bulgaria',
      'Denmark',
      'Finland',
      'Slovakia',
      'Ireland',
      'Croatia',
      'Lithuania',
      'Slovenia',
      'Latvia',
      'Estonia',
      'Cyprus',
      'Luxembourg',
      'Malta',
      'Canada',
      'United Kingdom',
      'United States',
    ]

    const results: Record<string, any> = {}

    for (let country of countries) {
      try {
        const countryAgeDistributionWithType = countryAgeDistribution as Record<string, any>
        const result = await run(
          {
            ...populationScenarios.filter(p => p.name === country)[0].data,
            ...epidemiologicalScenarios[1].data,
            ...simulationData,
          },
          severityData,
          countryAgeDistributionWithType[country],
          containmentScenarios[3].data.reduction,
        )
        results[country] = result
      } catch (e) {
        console.error(e)
      }
    }
    let attributes = [...countries, 'deterministicTrajectory', 'time', 'total', 'infectious']
  })
})
