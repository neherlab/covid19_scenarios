import { Convert } from '../../../.generated/types'

import CaseCountsValidate from '../../../.generated/CaseCountsValidate'
import rawCaseCounts from '../../../assets/data/case_counts.json'

import CountryAgeDistributionValidate from '../../../.generated/CountryAgeDistributionValidate'
import rawCountryAgeDistribution from '../../../assets/data/country_age_distribution.json'

import SeverityValidate from '../../../.generated/SeverityValidate'
import rawSeverity from '../../../assets/data/severityData.json'

import ScenariosValidate from '../../../.generated/ScenariosValidate'
import rawScenarios from '../../../assets/data/scenarios/scenarios.json'

describe('data', () => {
  it('CaseCounts should match schemas', () => {
    const result = CaseCountsValidate(rawCaseCounts)
    expect(result).toBeTrue()
    const converted = Convert.toCaseCounts(JSON.stringify(rawCaseCounts))
    expect(converted).toBeArray()
  })

  it('CountryAgeDistribution should match schemas', () => {
    const result = CountryAgeDistributionValidate(rawCountryAgeDistribution)
    expect(result).toBeTrue()
    const converted = Convert.toCountryAgeDistribution(JSON.stringify(rawCountryAgeDistribution))
    expect(converted).toBeArray()
  })

  it('Severity should match schemas', () => {
    const result = SeverityValidate(rawSeverity)
    expect(result).toBeTrue()
    const converted = Convert.toSeverity(JSON.stringify(rawSeverity))
    expect(converted).toBeArray()
  })

  it('Scenarios should match schemas', () => {
    const result = ScenariosValidate(rawScenarios)
    expect(result).toBeTrue()
    const converted = Convert.toScenario(JSON.stringify(rawScenarios))
    expect(converted).toBeArray()
  })
})
