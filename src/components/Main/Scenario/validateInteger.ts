import * as yup from 'yup'

import i18next from 'i18next'
/**
 * Checks that a given value is a valid integer and if not, attempts
 * to cast it as such.. If unsuccesful, returns a NaN and an error message.
 */
export function validateInteger(
  value: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  zeroOrPositive = false,
): { value: number; error?: string } {
  let integerSchema = yup.number().integer(i18next.t('This value should be a integer')).required(i18next.t('Required'))

  if (zeroOrPositive) {
    integerSchema = integerSchema.min(0, i18next.t('This value should be non-negative'))
  }

  try {
    const castedValue = integerSchema.validateSync(value)
    return { value: castedValue, error: undefined }
  } catch (valError) {
    const validationError = valError as yup.ValidationError
    try {
      const castedValue = integerSchema.cast(value)
      return { value: castedValue, error: validationError.message }
    } catch (typeError) {
      return { value: NaN, error: validationError.message }
    }
  }
}

export function validatePositiveInteger(
  value: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  zeroOrPositive = false,
): { value: number; error?: string } {
  return validateInteger(value, true)
}
