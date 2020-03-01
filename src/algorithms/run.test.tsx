import { AllParams, Month } from './Param.types'

import countryAgeDistribution from './test-data/ageDistribution.small.example'
import severity from './test-data/severity.small.example'

import run from './run'

const defaultParams: AllParams = {
  populationServed: 100000,
  ageDistribution: 'Germany',
  suspectedCasesToday: 10,
  importsPerDay: 2,
  r0: 2.2,
  serialInterval: 8,
  seasonalForcing: 0.2,
  peakMonth: Month.Jan,
}

describe('run()', () => {
  it('should return hello world', async () => {
    const result = await run(defaultParams, severity, countryAgeDistribution)
    expect(result).toBeObject()
    expect(result?.hello).toBe('world')
  })

  it('should work for all r0', async () => {
    // Override r0 for this test
    const params = { ...defaultParams, r0: 0.85 }

    const result = await run(params, severity, countryAgeDistribution)
    expect(result).toBeObject()
    expect(result?.hello).toBe('world')
  })
})
