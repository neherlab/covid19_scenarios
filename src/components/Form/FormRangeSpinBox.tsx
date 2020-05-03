/* eslint-disable react/no-array-index-key */
import React from 'react'

import { Col, FormGroup, Row } from 'reactstrap'
import { getFormikErrors } from '../../helpers/getFormikErrors'

import type { FormSpinBoxProps } from './FormSpinBox'

import FormLabel from './FormLabel'
import { RangeSpinBox } from './RangeSpinBox'

export function FormRangeSpinBox<T>({
  identifier,
  label,
  help,
  step,
  min,
  max,
  pattern,
  errors,
  touched,
}: FormSpinBoxProps<T>) {
  const errorMessages = getFormikErrors({ identifier, errors, touched })

  return (
    <FormGroup inline className="my-0">
      <Row noGutters>
        <Col xl={6}>
          <FormLabel identifier={identifier} label={label} help={help} />
        </Col>
        <Col className="d-inline" xl={6}>
          <RangeSpinBox
            className={errorMessages.length > 0 ? 'border-danger' : ''}
            identifier={identifier}
            step={step}
            min={min}
            max={max}
            pattern={pattern}
          />
          {errorMessages.map((message, i) => (
            <div key={`${message} ([${i}])`} className="text-danger">
              {message}
            </div>
          ))}
        </Col>
      </Row>
    </FormGroup>
  )
}
