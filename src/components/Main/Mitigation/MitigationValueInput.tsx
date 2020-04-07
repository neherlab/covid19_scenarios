import React from 'react'

import { FastField, FieldProps } from 'formik'

import * as NumericInput from "react-numeric-input";

// Function to determine number of months to display on the datepicker.
function getNumberOfMonthsCount(media: { tiny: boolean; small: boolean; medium: boolean }) {
  const { tiny, small, medium } = media
  if (tiny) return 1
  if (small) return 2
  if (medium) return 3
  return 4
}

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
