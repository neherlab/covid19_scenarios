import React, { useState } from 'react'

import moment from 'moment'
import { DateRangePicker, FocusedInputShape } from 'react-dates'
import Media from 'react-media'
import { Col, FormGroup, Row } from 'reactstrap'
import {undef} from "@redux-saga/is";

export interface FormInputProps {
  id: string
  label: string
  startDate: Date
  endDate: Date
  allowPast?: boolean
  onStartDateChange(startDate: Date): void
  onEndDateChange(startDate: Date): void
}

export default function FormDatePicker({
  id,
  label,
  startDate,
  endDate,
  allowPast = true,
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
          <Media
            queries={{
              tiny: { maxWidth: 899 },
              small: { minWidth: 900, maxWidth: 1199 },
              medium: { minWidth: 1200, maxWidth: 1499 },
              large: { minWidth: 1500 },
            }}
          >
            {media => {
              const { small, medium, large } = media

              const numberOfMonths = small ? 2 : medium ? 3 : 4
              const orientation = small ? 'vertical' : 'horizontal'
              const withPortal = small

              return (
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
                  isOutsideRange={() => !allowPast}
                  numberOfMonths={numberOfMonths}
                  orientation={orientation}
                  withPortal={withPortal}
                  // required
                  displayFormat="DD MMM YYYY"
                  // startDatePlaceholderText="Start Date"
                  // endDatePlaceholderText="End Date"
                  small
                  // customArrowIcon={<>{/* Empty component */}</>}
                />
              )
            }}
          </Media>
        </Col>
      </Row>
    </FormGroup>
  )
}
