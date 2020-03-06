import React, { useState } from 'react'

import moment from 'moment'
import { DateRangePicker, FocusedInputShape } from 'react-dates'
import { Col, FormGroup, Row } from 'reactstrap'

export interface FormInputProps {
  id: string
  label: string
  startDate: Date
  endDate: Date
  onStartDateChange(startDate: Date): void
  onEndDateChange(startDate: Date): void
}

export default function FormDatePicker({
  id,
  label,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: FormInputProps) {
  const [focusedInput, setFocusedInput] = useState<FocusedInputShape| null>(null) // prettier-ignore

  return (
    <FormGroup>
      <Row>
        <Col xl={7}>
          <label htmlFor={id}>{label}</label>
        </Col>
        <Col xl={5}>
          <DateRangePicker
            startDate={moment(startDate)}
            startDateId={`${id}_start_date_id`}
            endDate={moment(endDate)}
            endDateId={`${id}_end_date_id`}
            onDatesChange={({ startDate, endDate }) => {
              if (startDate) {
                onStartDateChange(startDate.toDate())
              }

              if (endDate) {
                onEndDateChange(endDate.toDate())
              }
            }}
            focusedInput={focusedInput}
            onFocusChange={focusedInput => setFocusedInput(focusedInput)}
          />
        </Col>
      </Row>
    </FormGroup>
  )
}
