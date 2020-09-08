import React from 'react'

import classNames from 'classnames'
import { Field } from 'formik'

export interface FormSpinBoxProps extends React.HTMLProps<HTMLInputElement> {
  identifier: string
  step?: number | string
  min?: number
  max?: number
  pattern?: string
  hasError?: boolean
}

export function SpinBox({ identifier, step, min, max, pattern, hasError, ...restProps }: FormSpinBoxProps) {
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
