/* eslint-disable react/no-array-index-key */
import React from 'react'

import _ from 'lodash'

import { Col, FormGroup, Row } from 'reactstrap'

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
  const isTouched = _.get(touched, identifier)
  const errorMessages = _.get(errors, identifier) as string[]
  const showError = errorMessages && isTouched

  return (
    <FormGroup inline className="my-0">
      <Row noGutters>
        <Col xl={6}>
          <FormLabel identifier={identifier} label={label} help={help} />
        </Col>
        <Col className="d-inline" xl={6}>
          <RangeSpinBox
            identifier={identifier}
            step={step}
            min={min}
            max={max}
            pattern={pattern}
            errors={errors}
            touched={touched}
          />
          {showError
            ? errorMessages.map((errorMessage, i) => (
                <div key={`${errorMessage} ([${i}])`} className="text-danger">
                  {errorMessage}
                </div>
              ))
            : null}
        </Col>
      </Row>
    </FormGroup>
  )
}
