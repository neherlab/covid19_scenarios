import { get, isEmpty } from 'lodash'

import { FormikErrors, FormikTouched, FormikValues } from 'formik'

export type GetErrorParams = {
  identifier: string
  errors?: FormikErrors<FormikValues>
  touched?: FormikTouched<FormikValues>
}

export function getFormikError({ identifier, errors, touched }: GetErrorParams): string | undefined {
  const isTouched = get(touched, identifier)
  const errorMessage = get(errors, identifier)
  const showError = errorMessage && isTouched
  return showError ? (errorMessage as string) : undefined
}

export interface ErrorMessages {
  errorMessages: string[]
  isTouched: boolean
  hasError: boolean
}

export function getErrorMessages<T>(
  identifier: string,
  errors?: FormikErrors<T>,
  touched?: FormikTouched<T>,
): ErrorMessages {
  const isTouched = !isEmpty(get(touched, identifier))

  let errorMessages = get(errors, identifier)
  if (typeof errorMessages === 'string') {
    errorMessages = [errorMessages]
  } else if (typeof errorMessages === 'object') {
    errorMessages = Object.values(errorMessages)
  } else {
    errorMessages = []
  }
  const hasError = Boolean(!isEmpty(errorMessages) && isTouched)
  return { errorMessages, isTouched, hasError }
}
