import React from 'react'

import _ from 'lodash'

import { Field, FormikErrors, FormikTouched } from 'formik'
import { InputGroup } from 'reactstrap'

import { getFormikError } from '../../helpers/getFormikError'

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
  const errorFirst = getFormikError({ errors, touched, identifier: `${identifier}[0]` })
  const errorSecond = getFormikError({ errors, touched, identifier: `${identifier}[1]` })
  const borderDangerFirst = errorFirst ? 'border-danger' : ''
  const borderDangerSecond = errorSecond ? 'border-danger' : ''

  return (
    <InputGroup>
      <Field
        className={`form-control d-inline ${borderDangerFirst}`}
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
        className={`form-control d-inline  ${borderDangerSecond}`}
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
