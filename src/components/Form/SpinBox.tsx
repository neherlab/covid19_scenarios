import React from 'react'

import classNames from 'classnames'
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
  const hasError = errorMessage.length > 0
  return (
    <Field
      className={classNames('form-control', 'd-inline', hasError && 'border-danger')}
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
