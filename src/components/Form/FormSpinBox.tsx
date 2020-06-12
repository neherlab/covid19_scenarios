import React from 'react'

import classNames from 'classnames'
import { Field, FormikErrors, FormikTouched } from 'formik'
import { Col, FormGroup, Row } from 'reactstrap'
import { getFormikErrors } from '../../helpers/getFormikErrors'

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
  const errorMessages = getFormikErrors({ identifier, errors, touched })
  const hasError = errorMessages.length > 0

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
                className={classNames(`form-control form-spinbox`, hasError && 'border-danger')}
                id={identifier}
                name={identifier}
                type="number"
                step={step}
                min={min}
                max={max}
                pattern={pattern}
              />
              {errorMessages.map((message) => (
                <div key={message} className="my-0 text-right text-danger">
                  {message}
                </div>
              ))}
            </Col>
          </Row>
        </FormGroup>
      )}
    </Field>
  )
}
