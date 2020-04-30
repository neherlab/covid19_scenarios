import React from 'react'

import { Field, FormikErrors, FormikTouched } from 'formik'

import { getFormikErrors } from '../../helpers/getFormikErrors'

export interface FormSpinBoxProps<T> extends React.HTMLProps<HTMLInputElement> {
  identifier: string
  step?: number | string
  min?: number
  max?: number
  pattern?: string
  errors?: FormikErrors<T>
  touched?: FormikTouched<T>
}

export function SpinBox<T>({
  identifier,
  step,
  min,
  max,
  pattern,
  errors,
  touched,
  ...restProps
}: FormSpinBoxProps<T>) {
  const errorMessage = getFormikErrors({ errors, touched, identifier: `${identifier}[0]` })
  const borderDanger = errorMessage.length > 0 ? 'border-danger' : ''
  return (
    <Field
      className={`form-control d-inline ${borderDanger}`}
      id={identifier}
      name={identifier}
      type="number"
      step={step}
      min={min}
      max={max}
      pattern={pattern}
      {...restProps}
    />
  )
}
