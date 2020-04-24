import { AgeDistributionArray, AgeDistributionData, Convert } from '../../../.generated/types'
import validateAgeDistributionArray, { errors } from '../../../.generated/validateAgeDistributionArray'
import ageDistributionRaw from '../../../assets/data/ageDistribution.json'

function validate(): AgeDistributionData[] {
  const valid = validateAgeDistributionArray(ageDistributionRaw)
  if (!valid) {
    throw errors
  }

  // FIXME: we cannot afford to Convert.toCountryAgeDistribution(), too slow
  return ((ageDistributionRaw as unknown) as AgeDistributionArray).all
}

const ageDistributions = validate()
export const ageDistributionNames = ageDistributions.map((cad) => cad.data)

export function getAgeDistribution(name: string) {
  const ageDistributionFound = ageDistributions.find((cad) => cad.name === name)
  if (!ageDistributionFound) {
    throw new Error(`Error: country age distribution "${name}" not found in JSON`)
  }

  // FIXME: this should be changed, too hacky
  const ageDistribution = Convert.toAgeDistributionData(JSON.stringify(ageDistributionFound))
  return ageDistribution.data
}
