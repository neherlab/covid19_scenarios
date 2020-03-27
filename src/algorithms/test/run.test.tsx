import 'jest-extended'
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
    const results: Array<Promise<AlgorithmResult>> = populationScenarios.map((populationScenario) => {
      return run(
        {
          ...populationScenario.data,
          ...epidemiologicalScenarios[1].data,
          ...simulationData,
        },
        severityData,
        // TODO: Remove this compilation failure
        // @ts-ignore
        countryAgeDistribution[populationScenario.data.country],
        containmentScenarios[3].data.reduction,
      )
    })

    const finished = await Promise.all(results)

    expect(finished).toHaveLength(results.length)
  })
})
