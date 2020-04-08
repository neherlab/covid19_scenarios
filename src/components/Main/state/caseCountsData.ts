import { CaseCounts, Convert } from '../../../.generated/types'
import CaseCountsValidate, { errors } from '../../../.generated/CaseCountsValidate'
import allCaseCountsRaw from '../../../assets/data/case_counts.json'

function validate(): CaseCounts[] {
  const valid = CaseCountsValidate(allCaseCountsRaw)
  if (!valid) {
    console.error(errors)
    throw new Error('caseCountData validation error (see errors above)')
  }

  // FIXME: we cannot afford to Convert.toCaseCounts(), too slow
  return (allCaseCountsRaw as unknown) as CaseCounts[]
}

const caseCounts = validate()
export const caseCountsNames = caseCounts.map((cc) => cc.country)

export function getCaseCountsData(key: string) {
  const caseCountFound = caseCounts.find((cc) => cc.country === key)
  if (!caseCountFound) {
    throw new Error(`Error: case counts "${key}" not found in JSON`)
  }

  // FIXME: this should be changed, too hacky
  const [caseCount] = Convert.toCaseCounts(JSON.stringify([caseCountFound]))
  return caseCount.empiricalData
}
