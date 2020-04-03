import Ajv from 'ajv'
import caseCountsSchema from '../../schemas/CaseCounts.schema.json'
import countryAgeSchema from '../../schemas/CountryAgeDistribution.schema.json'
import caseCountsData from '../assets/data/case_counts.json'
import countryAgeData from '../assets/data/country_age_distribution.json'

describe('data', () => {
  describe('should match schemas', () => {
    it.each([
      ['case_counts', caseCountsSchema, caseCountsData],
      ['country_age_distribution', countryAgeSchema, countryAgeData],
    ])('%s.json should match schema', (name, schema, data) => {
      const ajv = new Ajv({
        logger: {
          log: console.log,
          warn: console.warn,
          error: console.error,
        },
      })
      const result = ajv.validate(schema, data)
      if (typeof result === 'boolean') {
        if (!result) {
          console.error(ajv.errors)
          fail(`${name} doesn't match schema`)
        }
      } else {
        fail('should not be async')
      }
    })
  })
})
