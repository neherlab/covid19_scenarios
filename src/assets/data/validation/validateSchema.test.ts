import Ajv from 'ajv'
import caseCountsSchema from './schemas/case_counts.schema.json'
import populationSchema from './schemas/populations.schema.json'
import countryAgeSchema from './schemas/country_age_distribution.schema.json'
import caseCountsData from '../case_counts.json'
import populationData from '../population.json'
import countryAgeData from '../country_age_distribution.json'

describe('data', () => {
  describe('should match schemas', () => {
    it.each([
      ['case_counts', caseCountsSchema, caseCountsData],
      ['population', populationSchema, populationData],
      ['country_age_distribution', countryAgeSchema, countryAgeData],
    ])('%s.json should match schema', (name, schema, data) => {
      const ajv = new Ajv({
        logger: {
          log: console.log,
          warn: console.warn,
          error: console.error
        }
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
