import { AllParamsFlat } from '../types/Param.types'
import { AlgorithmResult } from '../types/Result.types'

import { CountryAgeDistribution } from '../../assets/data/CountryAgeDistribution.types'
import countryAgeDistribution from '../../assets/data/country_age_distribution.json'
import severityData from '../../assets/data/severityData.json'
import populationScenarios from '../../assets/data/scenarios/populations'
import epidemiologicalScenarios from '../../assets/data/scenarios/epidemiological'
import simulationData from '../../assets/data/scenarios/simulation'
import containmentScenarios from '../../assets/data/scenarios/containment'

import run from '../run'

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

    const countryAgeDistributionWithType = countryAgeDistribution as CountryAgeDistribution

    const results: Array<Promise<AlgorithmResult>> = countries.map((country) => {
      const populationScenario = populationScenarios.find((p) => p.name === country)

      // Confirm that the populationScenario is defined, because
      // then we can safely apply the "! - Non-null assertion operator"
      expect(populationScenario).toBeDefined()

      return run(
        {
          ...populationScenario!.data,
          ...epidemiologicalScenarios[1].data,
          ...simulationData,
        },
        severityData,
        countryAgeDistributionWithType[populationScenario!.data.country],
        containmentScenarios[3].data.reduction,
      )
    })

    await Promise.all(results)
  })
})
