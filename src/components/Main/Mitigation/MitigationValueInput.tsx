import React from 'react'

import { FastField, FieldProps } from 'formik'

import * as NumericInput from 'react-numeric-input'

export interface MitigationValueInputProps {
  identifier: string
  value: number
  min: number
  max: number
  step: number
}

export function MitigationValueInput({ identifier, value, min, max, step }: MitigationDatePickerProps) {
  return (
    <FastField name={identifier} className="form-control">
      {({ form: { setFieldValue } }: FieldProps<DateRange>) => {
        return (
          <NumericInput className="h-100"
          aria-label="mitigation value"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(newValue) => setFieldValue(identifier, newValue)}
        />
        )
      }}
    </FastField>
  )
}
