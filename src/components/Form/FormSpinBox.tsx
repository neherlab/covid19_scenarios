import React from 'react'

import _ from 'lodash'

import { Field, FormikErrors, FormikTouched } from 'formik'
import { Col, FormGroup, Row } from 'reactstrap'

import FormLabel from './FormLabel'

export interface FormSpinBoxProps<T> {
  identifier: string
  label: string
  help?: string | React.ReactNode
  step?: number | string
  min?: number | string
  max?: number | string
  pattern?: string
  errors?: FormikErrors<T>
  touched?: FormikTouched<T>
}

export function FormSpinBox<T>({
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

  return (
    <Field>
      {() => (
        <FormGroup className="my-0">
          <Row noGutters>
            <Col xl={7}>
              <FormLabel identifier={identifier} label={label} help={help} />
            </Col>
            <Col xl={5}>
              <Field
                className={`form-control ${borderDanger}`}
                id={identifier}
                name={identifier}
                type="number"
                step={step}
                min={min}
                max={max}
                pattern={pattern}
              />
              {showError ? <div className="text-danger">{errorMessage}</div> : null}
            </Col>
          </Row>
        </FormGroup>
      )}
    </Field>
  )
}
