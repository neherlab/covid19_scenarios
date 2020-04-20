import React from 'react'

import { FormikErrors, FormikTouched } from 'formik'
import { InputGroup } from 'reactstrap'

import { SpinBox } from './SpinBox'

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
  return (
    <InputGroup>
      <SpinBox
        className="form-control d-inline"
        identifier={`${identifier}[0]`}
        type="number"
        step={step}
        min={min}
        max={max}
        pattern={pattern}
      />
      <span className="h-100 pt-2 px-1 text-bold">{'-'}</span>
      <SpinBox
        className="form-control d-inline"
        identifier={`${identifier}[1]`}
        type="number"
        step={step}
        min={min}
        max={max}
        pattern={pattern}
      />
    </InputGroup>
  )
}
