import React, { useState } from 'react'

import moment from 'moment'
import { DateRangePicker as AirbnbDateRangePicker, DateRangePickerShape, FocusedInputShape } from 'react-dates'

import { DateRange } from '../../algorithms/types/Param.types'

export interface DateRangePickerProps extends Partial<DateRangePickerShape> {
  identifier: string
  value: DateRange
  allowPast: boolean

  setValue(value: DateRange): void
}

export function DateRangePicker({ identifier, value, allowPast, setValue, ...otherProps }: DateRangePickerProps) {
  const [focusedInput, setFocusedInput] = useState<FocusedInputShape | null>(null)

  const { begin, end } = value

  return (
    <AirbnbDateRangePicker
      startDate={moment(begin)}
      startDateId={`${identifier}_start_date_id`}
      endDate={moment(end)}
      endDateId={`${identifier}_end_date_id`}
      onDatesChange={({ startDate, endDate }) => {
        if (startDate && endDate) {
          setValue({ begin: startDate.toDate(), end: endDate.toDate() })
        } else if (startDate) {
          setValue({ ...value, begin: startDate.toDate() })
        } else if (endDate) {
          setValue({ ...value, end: endDate.toDate() })
        }
      }}
      focusedInput={focusedInput}
      onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
      isOutsideRange={() => !allowPast}
      displayFormat="DD MMM YYYY"
      small
      {...otherProps}
    />
  )
}
