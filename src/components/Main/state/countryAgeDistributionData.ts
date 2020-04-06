import Ajv from 'ajv'

import { CountryAgeDistribution, Convert } from '../../../.generated/types/types'

import allCountryAgeDistributionRaw from '../../../assets/data/country_age_distribution.json'
import schema from '../../../../schemas/CountryAgeDistribution.yml'

function validate() {
  const ajv = new Ajv()
  const valid = ajv.validate(schema, allCountryAgeDistributionRaw)
  if (!valid) {
    console.error(ajv.errors)
    throw new Error('countryAgeDistributionData validation error')
  }
  return (allCountryAgeDistributionRaw as unknown) as CountryAgeDistribution[]
}

const allCountryAgeDistributionRawValidated = validate()

export const ageDistributionNames = allCountryAgeDistributionRawValidated.map((cad) => cad.country)

export function getCountryAgeDistribution(key: string) {
  const countryAgeDistributionRaw = allCountryAgeDistributionRawValidated.find((cad) => cad.country === key)
  if (!countryAgeDistributionRaw) {
    throw new Error(`Error: country age distribution "${key}" not found in JSON`)
  }
  return Convert.toAgeDistribution(JSON.stringify(countryAgeDistributionRaw.ageDistribution))
}
