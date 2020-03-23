import React, { useState } from 'react'

import { Field, FieldProps } from 'formik'
import moment from 'moment'
import { DateRangePicker, FocusedInputShape } from 'react-dates'
import Media from 'react-media'
import { Col, FormGroup, Row } from 'reactstrap'

import FormLabel from './FormLabel'

import { DateRange } from '../../algorithms/types/Param.types'

// Function to determine number of months to display on the datepicker.
function getNumberOfMonthsCount(media: { tiny: boolean; small: boolean; medium: boolean }) {
  const { tiny, small, medium } = media
  if (tiny) return 1
  if (small) return 2
  if (medium) return 3
  return 4
}

export interface FormDatePickerProps {
  identifier: string
  label: string
  help?: string | React.ReactNode
  allowPast?: boolean
}

export function FormDatePicker({ identifier, label, help, allowPast = true }: FormDatePickerProps) {
  const [focusedInput, setFocusedInput] = useState<FocusedInputShape | null>(null)

  return (
    <Field name={identifier}>
      {({ field: { value, onChange }, form: { setFieldValue } }: FieldProps<DateRange>) => {
        return (
          <FormGroup className="my-0">
            <Row noGutters>
              <Col xl={7}>
                <FormLabel identifier={identifier} label={label} help={help} />
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
                  {(media) => {
                    const { small } = media

                    const numberOfMonths = getNumberOfMonthsCount(media)
                    const orientation = small ? 'vertical' : 'horizontal'
                    const withPortal = small

                    const { tMin, tMax } = value

                    return (
                      <DateRangePicker
                        startDate={moment(tMin)}
                        startDateId={`${identifier}_start_date_id`}
                        endDate={moment(tMax)}
                        endDateId={`${identifier}_end_date_id`}
                        onDatesChange={({ startDate, endDate }) => {
                          if (startDate && endDate) {
                            setFieldValue(identifier, {
                              tMin: startDate.toDate(),
                              tMax: endDate.toDate(),
                            })
                          } else if (startDate) {
                            setFieldValue(identifier, {
                              ...value,
                              tMin: startDate.toDate(),
                            })
                          } else if (endDate) {
                            setFieldValue(identifier, {
                              ...value,
                              tMax: endDate.toDate(),
                            })
                          }
                        }}
                        focusedInput={focusedInput}
                        onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
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
      }}
    </Field>
  )
}
