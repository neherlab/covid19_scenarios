import { Convert, SeverityDistributionArray, SeverityDistributionData } from '../../../algorithms/types/Param.types'
import validateSeverityDistributionArray, { errors } from '../../../.generated/latest/validateSeverityDistributionArray'
import severityRaw from '../../../assets/data/severityDistributions.json'

function validate(): SeverityDistributionData[] {
  const valid = validateSeverityDistributionArray(severityRaw)
  if (!valid) {
    throw errors
  }

  // FIXME: we cannot afford to use `Converter` here, too slow
  return ((severityRaw as unknown) as SeverityDistributionArray).all
}

const severityDistributions = validate()
export const scenarioNames = severityDistributions.map((scenario) => scenario.name)

export function getSeverityDistribution(name: string) {
  const severityDistributionFound = severityDistributions.find((s) => s.name === name)
  if (!severityDistributionFound) {
    throw new Error(`Error: scenario "${name}" not found in JSON`)
  }

  // FIXME: this should be changed, too hacky
  const severityDistribution = Convert.toSeverityDistributionData(JSON.stringify(severityDistributionFound))
  return severityDistribution.data.sort((a, b) => {
    if (a.ageGroup > b.ageGroup) {
      return +1
    }

    if (a.ageGroup < b.ageGroup) {
      return -1
    }

    return 0
  })
}
