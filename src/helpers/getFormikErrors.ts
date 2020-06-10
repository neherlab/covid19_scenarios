import { get, isEmpty } from 'lodash'

import { FormikErrors, FormikTouched, FormikValues } from 'formik'

export interface GetErrorParams {
  identifier: string
  errors?: FormikErrors<FormikValues>
  touched?: FormikTouched<FormikValues> | true
}

export function getFormikErrors({ identifier, errors, touched }: GetErrorParams): string[] {
  // const isTouched = (typeof touched === 'boolean' && touched === true) || get(touched, identifier)
  const errorMessage = get(errors, identifier)

  if (!errorMessage || isEmpty(errorMessage) /* || !isTouched */) {
    return []
  }

  if (typeof errorMessage === 'string') {
    return [errorMessage]
  }

  if (Array.isArray(errorMessage)) {
    return errorMessage as string[]
  }

  return Object.values(errorMessage) as string[]
}
