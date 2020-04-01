import React from 'react'

import { FastField, FieldProps } from 'formik'
import Media from 'react-media'

import { DateRange } from '../../../algorithms/types/Param.types'

import { DateRangePicker } from '../../Form/DateRangePicker'

// Function to determine number of months to display on the datepicker.
function getNumberOfMonthsCount(media: { tiny: boolean; small: boolean; medium: boolean }) {
  const { tiny, small, medium } = media
  if (tiny) return 1
  if (small) return 2
  if (medium) return 3
  return 4
}

export interface MitigationDatePickerProps {
  identifier: string
  value: DateRange
  allowPast?: boolean
}

export function MitigationDatePicker({ identifier, value, allowPast = true }: MitigationDatePickerProps) {
  return (
    <FastField name={identifier}>
      {({ form: { setFieldValue } }: FieldProps<DateRange>) => {
        return (
          <Media
            queries={{
              tiny: { maxWidth: 899 },
              small: { minWidth: 900, maxWidth: 1199 },
              medium: { minWidth: 1200, maxWidth: 1499 },
              large: { minWidth: 1500 },
            }}
          >
            {(media) => {
              const { small } = media

              const numberOfMonths = getNumberOfMonthsCount(media)
              const orientation = small ? 'vertical' : 'horizontal'
              const withPortal = small

              return (
                <DateRangePicker
                  identifier={identifier}
                  value={value}
                  setValue={(value) => setFieldValue(identifier, value)}
                  allowPast={allowPast}
                  numberOfMonths={numberOfMonths}
                  orientation={orientation}
                  withPortal={withPortal}
                />
              )
            }}
          </Media>
        )
      }}
    </FastField>
  )
}
