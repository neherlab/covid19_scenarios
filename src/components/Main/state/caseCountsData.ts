import { Convert } from '../../../.generated/types'
import CaseCountsValidate, { errors } from '../../../.generated/CaseCountsValidate'
import allCaseCountsRaw from '../../../assets/data/case_counts.json'

function validate() {
  const valid = CaseCountsValidate(allCaseCountsRaw)
  if (!valid) {
    console.error(errors)
    throw new Error('caseCountData validation error (see errors above)')
  }
}

validate()
const caseCounts = Convert.toCaseCounts(JSON.stringify(allCaseCountsRaw))
export const caseCountsNames = caseCounts.map((cc) => cc.country)

export function getCaseCountsData(key: string) {
  const caseCount = caseCounts.find((cc) => cc.country === key)
  if (!caseCount) {
    throw new Error(`Error: case counts "${key}" not found in JSON`)
  }
  return caseCount.empiricalData
}
