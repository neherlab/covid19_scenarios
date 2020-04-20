/* eslint-disable react/no-array-index-key */
import React from 'react'

import _ from 'lodash'

import { FormikErrors, FormikTouched } from 'formik'
import { Col, FormGroup, Row } from 'reactstrap'

import FormLabel from './FormLabel'
import { RangeSpinBox } from './RangeSpinBox'

export interface FormRangeSpinBoxProps<T> {
  identifier: string
  label: string
  help?: string | React.ReactNode
  step?: number | string
  min?: number
  max?: number
  pattern?: string
  errors?: FormikErrors<T>
  touched?: FormikTouched<T>
}

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
}: FormRangeSpinBoxProps<T>) {
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
