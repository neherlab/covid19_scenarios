import React from 'react'

import _ from 'lodash'

import { Field, FormikErrors, FormikTouched } from 'formik'
import { Col, FormGroup, InputGroup, Row } from 'reactstrap'

import FormLabel from './FormLabel'

export interface FormSpinBoxProps<T> {
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
}: FormSpinBoxProps<T>) {
  const isTouched = _.get(touched, identifier)
  const errorMessage = _.get(errors, identifier)
  const showError = errorMessage && isTouched
  const borderDanger = showError ? 'border-danger' : ''

  function validate(value: number) {
    let error
    if (min && value < min) {
      error = `The input cannot be less than ${min}`
    } else if (max && value > max) {
      error = `The input cannot be greater than ${max}`
    }
    return error
  }

  return (
    <FormGroup inline className="my-0">
      <Row noGutters>
        <Col xl={6}>
          <FormLabel identifier={identifier} label={label} help={help} />
        </Col>
        <Col className="d-inline" xl={6}>
          <InputGroup>
            <Field
              className={`form-control d-inline ${borderDanger}`}
              id={identifier}
              name={`${identifier}[0]`}
              type="number"
              step={step}
              min={min}
              max={max}
              pattern={pattern}
              validate={validate}
            />
            <span className="h-100 pt-2 px-1 text-bold">{'-'}</span>
            <Field
              className={`form-control d-inline  ${borderDanger}`}
              id={identifier}
              name={`${identifier}[1]`}
              type="number"
              step={step}
              min={min}
              max={max}
              pattern={pattern}
              validate={validate}
            />
          </InputGroup>
          {showError ? <div className="text-danger">{errorMessage}</div> : null}
        </Col>
      </Row>
    </FormGroup>
  )
}
