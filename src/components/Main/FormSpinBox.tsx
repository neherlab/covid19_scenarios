import React from 'react'

import { Field } from 'formik'
import { FormGroup } from 'reactstrap'

export interface FormSpinBoxProps {
  id: string
  label: string
  step?: number | string
  min?: number | string
  max?: number | string
  pattern?: string
}

export default function FormSpinBox({
  id,
  label,
  step,
  min,
  max,
  pattern,
}: FormSpinBoxProps) {
  return (
    <FormGroup>
      <label htmlFor={id}>{label}</label>
      <Field
        className="form-control"
        id={id}
        name={id}
        type="number"
        step={step}
        min={min}
        max={max}
        pattern={pattern}
      />
    </FormGroup>
  )
}
