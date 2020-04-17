import { CaseCounts, Convert } from '../../../.generated/types'
import CaseCountsValidate, { errors } from '../../../.generated/CaseCountsValidate'
import allCaseCountsRaw from '../../../assets/data/case_counts.json'
import { NONE_COUNTRY_NAME } from './state'
import { EmpiricalData } from '../../../algorithms/types/Param.types'
import { ImportedCaseCount } from '../Results/ImportCaseCountDialog'

const CUSTOM_CASE_COUNT_KEY = 'customCaseCount'

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

export function getCaseCountsData(key: string): EmpiricalData {
  if (key === NONE_COUNTRY_NAME) {
    return []
  }

  const customCaseCount = getUserCaseCount()

  if (customCaseCount) {
    return customCaseCount.data
  }

  const caseCountFound = caseCounts.find((cc) => cc.country === key)
  if (!caseCountFound) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`
        Developer warning: requested case counts for "${key}", but this entry is not present in the data.
        This probably means that the data has an incorrect reference to non-existing case counts.

        Returning an empty case counts array. However the app state will not be adjusted.
        This means that the incorrect name "${key}" will be visible in the UI, but no actual case data will be present`)
    }
    return []
  }

  // FIXME: this should be changed, too hacky
  const [caseCount] = Convert.toCaseCounts(JSON.stringify([caseCountFound]))
  return caseCount.empiricalData
}

export function getUserCaseCount(): ImportedCaseCount | undefined {
  const data = sessionStorage.getItem(CUSTOM_CASE_COUNT_KEY)
  return data ? JSON.parse(data) : undefined
}

export function saveUserCaseCount(userCaseCount: ImportedCaseCount): void {
  sessionStorage.setItem(CUSTOM_CASE_COUNT_KEY, JSON.stringify(userCaseCount))
}

export function resetUserCaseCount(): void {
  sessionStorage.removeItem(CUSTOM_CASE_COUNT_KEY)
}
