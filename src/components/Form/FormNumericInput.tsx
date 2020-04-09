import React from 'react'

import _ from 'lodash'

import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md'

import { Field, FormikErrors, FormikTouched } from 'formik'
import { Col, FormGroup, Row, Input, Button, ButtonGroup } from 'reactstrap'

import FormLabel from './FormLabel'
import NumericInput from './NumericInput'

export interface FormNumericInputProps<T> {
  identifier: string
  label: string
  help?: string | React.ReactNode
  step?: number | string
  precision?: number
  errors?: FormikErrors<T>
  touched?: FormikTouched<T>
}

export function FormNumericInput<T>({
  identifier,
  label,
  help,
  step,
  precision,
  errors,
  touched,
}: FormNumericInputProps<T>) {
  const isTouched = _.get(touched, identifier)
  const errorMessage = _.get(errors, identifier)
  const showError = errorMessage && isTouched

  return (
    <Field>
      {() => (
        <FormGroup className="my-0">
          <Row noGutters>
            <Col xl={7}>
              <FormLabel identifier={identifier} label={label} help={help} />
            </Col>
            <Col xl={5}>
              <NumericInput identifier={identifier} label={label} step={step} precision={precision}/>
              {showError ? <div className="text-danger">{errorMessage}</div> : null}
            </Col>
          </Row>
        </FormGroup>
      )}
    </Field>
  )
}
