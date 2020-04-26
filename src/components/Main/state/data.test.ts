import { Convert } from '../../../algorithms/types/Param.types'

import validateCaseCountsArray from '../../../.generated/validateCaseCountsArray'
import rawCaseCounts from '../../../assets/data/caseCounts.json'

import validateAgeDistributionArray from '../../../.generated/validateAgeDistributionArray'
import rawCountryAgeDistribution from '../../../assets/data/ageDistribution.json'

import validateSeverityDistributionArray from '../../../.generated/validateSeverityDistributionArray'
import rawSeverity from '../../../assets/data/severityDistributions.json'

import validateScenarioArray from '../../../.generated/validateScenarioArray'
import rawScenarios from '../../../assets/data/scenarios.json'

describe('data', () => {
  it('CaseCounts should match schemas', () => {
    const result = validateCaseCountsArray(rawCaseCounts)
    expect(result).toBeTrue()
    const converted = Convert.toCaseCountsArray(JSON.stringify(rawCaseCounts))
    expect(converted).toBeObject()
    expect(converted.all).toBeArray()
  })

  it('CountryAgeDistribution should match schemas', () => {
    const result = validateAgeDistributionArray(rawCountryAgeDistribution)
    expect(result).toBeTrue()
    const converted = Convert.toAgeDistributionArray(JSON.stringify(rawCountryAgeDistribution))
    expect(converted).toBeObject()
    expect(converted.all).toBeArray()
  })

  it('Severity should match schemas', () => {
    const result = validateSeverityDistributionArray(rawSeverity)
    expect(result).toBeTrue()
    const converted = Convert.toSeverityDistributionArray(JSON.stringify(rawSeverity))
    expect(converted).toBeObject()
    expect(converted.all).toBeArray()
  })

  it('Scenarios should match schemas', () => {
    const result = validateScenarioArray(rawScenarios)
    expect(result).toBeTrue()
    const converted = Convert.toScenarioArray(JSON.stringify(rawScenarios))
    expect(converted).toBeObject()
    expect(converted.all).toBeArray()
  })
})
