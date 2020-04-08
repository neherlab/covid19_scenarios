import React from 'react'

import _ from 'lodash'

import { Field, FieldProps } from 'formik'
import Media from 'react-media'
import { Col, FormGroup, Row } from 'reactstrap'

import FormLabel from './FormLabel'

import { DateRange } from '../../algorithms/types/Param.types'

import { DateRangePicker } from './DateRangePicker'

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
  label?: string
  help?: string | React.ReactNode
  allowPast?: boolean
}

export function FormDatePicker({ identifier, label, help, allowPast = true }: FormDatePickerProps) {
  return (
    <Field name={identifier}>
      {({ field: { value }, form: { setFieldValue } }: FieldProps<DateRange>) => {
        return (
          <FormGroup className="my-0">
            <Row noGutters>
              {label && !_.isEmpty(label) && (
                <Col xl={7}>
                  <FormLabel identifier={identifier} label={label} help={help} />
                </Col>
              )}
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
              </Col>
            </Row>
          </FormGroup>
        )
      }}
    </Field>
  )
}
