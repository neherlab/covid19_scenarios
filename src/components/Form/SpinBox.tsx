import React from 'react'

import classNames from 'classnames'
import { Field } from 'formik'

export interface FormSpinBoxProps<T> extends React.HTMLProps<HTMLInputElement> {
  identifier: string
  step?: number | string
  min?: number
  max?: number
  pattern?: string
  hasError?: boolean
}

export function SpinBox<T>({ identifier, step, min, max, pattern, hasError, ...restProps }: FormSpinBoxProps<T>) {
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
