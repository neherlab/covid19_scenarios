import React from 'react'

import _ from 'lodash'

import { Field, FormikErrors, FormikTouched } from 'formik'
import { InputGroup } from 'reactstrap'

export interface FormSpinBoxProps<T> {
  identifier: string
  step?: number | string
  min?: number
  max?: number
  pattern?: string
  errors?: FormikErrors<T>
  touched?: FormikTouched<T>
}

export function RangeSpinBox<T>({ identifier, step, min, max, pattern, errors, touched }: FormSpinBoxProps<T>) {
  const isTouched = _.get(touched, identifier)
  const errorMessage = _.get(errors, identifier)
  const showError = errorMessage && isTouched
  const borderDanger = showError ? 'border-danger' : ''

  return (
    <InputGroup>
      <Field
        className={`form-control d-inline ${borderDanger}`}
        id={identifier}
        name={`${identifier}[0]`}
        type="number"
        step={step}
        min={min}
        max={max}
        pattern={pattern}
      />
      <span className="h-100 pt-2 px-1 text-bold">{'-'}</span>
      <Field
        className={`form-control d-inline  ${borderDanger}`}
        id={identifier}
        name={`${identifier}[1]`}
        type="number"
        step={step}
        min={min}
        max={max}
        pattern={pattern}
      />
    </InputGroup>
  )
}
