import Ajv from 'ajv'

import { CaseCounts, Convert } from '../../../.generated/types/types'

import allCaseCountsRaw from '../../../assets/data/case_counts.json'
import schema from '../../../../schemas/CaseCounts.yml'

function validate() {
  const ajv = new Ajv()
  const valid = ajv.validate(schema, allCaseCountsRaw)
  if (!valid) {
    console.error(ajv.errors)
    throw new Error('caseCountData validation error')
  }
  return (allCaseCountsRaw as unknown) as CaseCounts[]
}

const allCaseCountsRawValidated = validate()

export const caseCountsNames = allCaseCountsRawValidated.map((cc) => cc.country)

export function getCaseCountsData(key: string) {
  const caseCountsRaw = allCaseCountsRawValidated.find((cc) => cc.country === key)
  if (!caseCountsRaw) {
    throw new Error(`Error: case counts "${key}" not found in JSON`)
  }
  return Convert.toCaseCounts(JSON.stringify(caseCountsRaw)).empiricalData
}
