import React from 'react'

import _ from 'lodash'

import * as NumericInput from 'react-numeric-input'

import { Field, FormikErrors, FormikTouched } from 'formik'
import { Col, FormGroup, Row } from 'reactstrap'

import FormLabel from './FormLabel'

export interface FormNumericInputProps<T> {
  identifier: string
  label: string
  help?: string | React.ReactNode
  step?: number | string
  min?: number
  max?: number
  value: number
  errors?: FormikErrors<T>
  touched?: FormikTouched<T>
}

export function FormNumericInput<T>({
  identifier,
  label,
  help,
  step,
  min,
  max,
  value,
  errors,
  touched,
}: FormNumericInputProps<T>) {
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
              <Field name={identifier} className={`form-control ${borderDanger}`}>
                {({ form: { setFieldValue } }: FieldProps<number>) => {
                  return (
                    <NumericInput
                      className="h-100"
                      aria-label={label}
                      min={min}
                      max={max}
                      step={step}
                      value={value}
                      required
                      onChange={(newValue) => setFieldValue(identifier, newValue)}
                      style={{input:{width:'100%',padding:'0.5em'}}}
                    />
                  )
                }}
              </Field>
              {showError ? <div className="text-danger">{errorMessage}</div> : null}

            </Col>
          </Row>
        </FormGroup>
      )}
    </Field>
  )
}
