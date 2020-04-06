import { Convert } from '../../../.generated/types'
import CountryAgeDistributionValidate, { errors } from '../../../.generated/CountryAgeDistributionValidate'
import allCountryAgeDistributionRaw from '../../../assets/data/country_age_distribution.json'

function validate() {
  const valid = CountryAgeDistributionValidate(allCountryAgeDistributionRaw)
  if (!valid) {
    console.error(errors)
    throw new Error('countryAgeDistributionData validation error (see errors above)')
  }
}

validate()
const countryAgeDistributions = Convert.toCountryAgeDistribution(JSON.stringify(allCountryAgeDistributionRaw))
export const ageDistributionNames = countryAgeDistributions.map((cad) => cad.country)

export function getCountryAgeDistribution(key: string) {
  const countryAgeDistribution = countryAgeDistributions.find((cad) => cad.country === key)
  if (!countryAgeDistribution) {
    throw new Error(`Error: country age distribution "${key}" not found in JSON`)
  }
  return countryAgeDistribution.ageDistribution
}
