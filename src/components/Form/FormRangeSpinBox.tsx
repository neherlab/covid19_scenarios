import React from 'react'

import { Col, FormGroup, Row } from 'reactstrap'

import { getErrorMessages } from '../../helpers/getFormikError'

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
  const { errorMessages, hasError } = getErrorMessages(identifier, errors, touched)

  return (
    <FormGroup inline className="my-0">
      <Row noGutters>
        <Col xl={6}>
          <FormLabel identifier={identifier} label={label} help={help} />
        </Col>
        <Col className="d-inline" xl={6}>
          <RangeSpinBox identifier={identifier} step={step} min={min} max={max} pattern={pattern} hasError={hasError} />

          {hasError &&
            errorMessages &&
            errorMessages.map((message) => (
              <div key={message} className="text-danger">
                {message}
              </div>
            ))}
        </Col>
      </Row>
    </FormGroup>
  )
}
