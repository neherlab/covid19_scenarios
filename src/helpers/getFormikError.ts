import _ from 'lodash'

import { FormikErrors, FormikTouched, FormikValues } from 'formik'

export interface GetErrorParams {
  identifier: string
  errors?: FormikErrors<FormikValues>
  touched?: FormikTouched<FormikValues>
}

export function getFormikError({ identifier, errors, touched }: GetErrorParams): string | undefined {
  const isTouched = _.get(touched, identifier)
  const errorMessage = _.get(errors, identifier)
  const showError = errorMessage && isTouched
  return showError ? (errorMessage as string) : undefined
}
