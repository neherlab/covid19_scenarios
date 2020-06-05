import { trim } from 'lodash'

import Ajv from 'ajv'
import ajvLocalizers from 'ajv-i18n'

import { CaseCountsArray, CaseCountsData, Convert } from '../../algorithms/types/Param.types'
import validateCaseCountsArray, { errors } from '../../.generated/latest/validateCaseCountsArray'
import validateCaseCountsData, { errors as dataErrors } from '../../.generated/latest/validateCaseCountsData'

import { DeserializationErrorValidationFailed, DeserializationErrorConversionFailed } from '../serialization/errors'

import caseCountsDataRaw from '../../assets/data/caseCounts.json'
import { NONE_COUNTRY_NAME } from '../../constants'

export function validateAll(): CaseCountsData[] {
  const valid = validateCaseCountsArray(caseCountsDataRaw)
  if (!valid) {
    throw errors
  }

  return ((caseCountsDataRaw as unknown) as CaseCountsArray).all
}

export function validate(caseCountsDataDangerous: object): void {
  if (!validateCaseCountsData(caseCountsDataDangerous)) {
    const locale = 'en' // TODO: use current locale
    const localize = ajvLocalizers[locale] ?? ajvLocalizers.en
    localize(dataErrors)

    const ajv = Ajv({ allErrors: true })
    const separator = '<<<NEWLINE>>>'
    const errorString = ajv.errorsText(dataErrors, { dataVar: '', separator })
    if (typeof errorString === 'string') {
      const errorStrings = errorString.split(separator).map(trim)
      if (errorStrings.length > 0) {
        throw new DeserializationErrorValidationFailed(errorStrings)
      }
    }

    throw new DeserializationErrorValidationFailed(['Unknown validation error'])
  }
}

export function convert(caseCountsDangerous: object): CaseCountsData {
  try {
    return Convert.toCaseCountsData(JSON.stringify(caseCountsDangerous))
  } catch (error) {
    if (error instanceof Error) {
      throw new DeserializationErrorConversionFailed(error.message)
    }

    throw new DeserializationErrorConversionFailed('Unknown conversion error')
  }
}

const manyCaseCountsData = validateAll()
export const caseCountsNames = manyCaseCountsData.map((cc) => cc.name)

export function getCaseCountsData(name: string) {
  if (name === NONE_COUNTRY_NAME) {
    return { name, data: [] }
  }

  const caseCountFound = manyCaseCountsData.find((cc) => cc.name === name)
  if (!caseCountFound) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`
        Developer warning: requested case counts for "${name}", but this entry is not present in the data.
        This probably means that the data has an incorrect reference to non-existing case counts.

        Returning an empty case counts array. However the app state will not be adjusted.
        This means that the incorrect name "${name}" will be visible in the UI, but no actual case data will be present`)
    }

    return { name, data: [] }
  }

  const caseCountsData = convert(caseCountFound)

  const data = caseCountsData.data
    .filter((d) => d.cases || d.deaths || d.icu || d.hospitalized)
    .sort((a, b) => (a.time > b.time ? 1 : -1))

  return { name, data }
}
