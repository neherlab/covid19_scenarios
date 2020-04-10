import { CountryAgeDistribution, Convert } from '../../../.generated/types'
import CountryAgeDistributionValidate, { errors } from '../../../.generated/CountryAgeDistributionValidate'
import allCountryAgeDistributionRaw from '../../../assets/data/country_age_distribution.json'

function validate(): CountryAgeDistribution[] {
  const valid = CountryAgeDistributionValidate(allCountryAgeDistributionRaw)
  if (!valid) {
    console.error(errors)
    throw new Error('countryAgeDistributionData validation error (see errors above)')
  }

  // FIXME: we cannot afford to Convert.toCountryAgeDistribution(), too slow
  return (allCountryAgeDistributionRaw as unknown) as CountryAgeDistribution[]
}

const countryAgeDistributions = validate()
export const ageDistributionNames = countryAgeDistributions.map((cad) => cad.country)

export function getCountryAgeDistribution(key: string) {
  const countryAgeDistributionFound = countryAgeDistributions.find((cad) => cad.country === key)
  if (!countryAgeDistributionFound) {
    throw new Error(`Error: country age distribution "${key}" not found in JSON`)
  }

  // FIXME: this should be changed, too hacky
  const [countryAgeDistribution] = Convert.toCountryAgeDistribution(JSON.stringify([countryAgeDistributionFound]))
  return countryAgeDistribution.ageDistribution
}
