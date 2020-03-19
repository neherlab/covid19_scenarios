import {AllParamsFlat} from './Param.types'

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
  ...epidemiologicalScenarios[0].data,
  ...simulationData
}

describe('run()', () => {
  it('should return hello world', async () => {
    const result = await run(defaultParams, severityData, countryAgeDistribution.Germany, containmentScenarios[0].data.reduction)
    expect(result).toBeObject()
  })

  it('should work for all r0', async () => {
    // Override r0 for this test
    const params = { ...defaultParams, r0: 0.85 }

    const result = await run(params, severityData, countryAgeDistribution.Germany, containmentScenarios[0].data.reduction)
    expect(result).toBeObject()
  })
})
