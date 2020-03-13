import { SeverityTableRow } from './SeverityTable'

import { validatePercentage } from './validatePercentage'

/**
 * Updates computable columns in severity table
 */
export function updateSeverityTable(severity: SeverityTableRow[]): SeverityTableRow[] {
  return severity.map(row => {
    const { value: isolated, errors: isolatedErrors } = validatePercentage(row.isolated)
    const { value: confirmed, errors: confirmedErrors } = validatePercentage(row.confirmed)
    const { value: severe, errors: severeErrors } = validatePercentage(row.severe)
    const { value: critical, errors: criticalErrors } = validatePercentage(row.critical)
    const { value: fatal, errors: fatalErrors } = validatePercentage(row.fatal)

    const totalFatal = confirmed * severe * critical * fatal * 1e-6

    const errors = {
      isolated: isolatedErrors,
      confirmed: confirmedErrors,
      severe: severeErrors,
      critical: criticalErrors,
      fatal: fatalErrors,
    }

    return {
      ...row,
      isolated,
      confirmed,
      severe,
      critical,
      fatal,
      totalFatal,
      errors,
    }
  })
}
