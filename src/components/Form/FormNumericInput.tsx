import React from 'react'

import _ from 'lodash'

import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md'

import { Field, FormikErrors, FormikTouched } from 'formik'
import { Col, FormGroup, Row, Input, Button, ButtonGroup } from 'reactstrap'

import FormLabel from './FormLabel'

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
  min,
  max,
  precision,
  errors,
  touched,
}: FormNumericInputProps<T>) {
  const isTouched = _.get(touched, identifier)
  const errorMessage = _.get(errors, identifier)
  const showError = errorMessage && isTouched

  const toPrecision = (value) =>
    Math.round((value + Number.EPSILON) * Math.pow(10, precision)) / Math.pow(10, precision)

  const increase = (value, step) => {
    const parsed = parseFloat(value)
    const result = parsed + step
    return toPrecision(result)
  }

  const decrease = (value, step) => {
    const parsed = parseFloat(value)
    const result = parsed - step
    return toPrecision(result)
  }

  const spinnerButtonStyle = {
    'font-size': '0rem',
    'padding': '0',
    'max-width': '1.5rem',
    'max-height': '1.2rem',
  }

  return (
    <Field>
      {() => (
        <FormGroup className="my-0">
          <Row noGutters>
            <Col xl={7}>
              <FormLabel identifier={identifier} label={label} help={help} />
            </Col>
            <Col xl={5}>
              <Field name={identifier}>
                {({ field, form: { setFieldValue, setFieldTouched } }: FieldProps<number>) => (
                  <Row noGutters>
                    <Col xs={10} sm={10} md={10} lg={10} xl={10}>
                      <Input type="text" inputMode="numeric" pattern="[0-9]+([,\.][0-9]+)?" aria-label={label} {...field} />
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                      <ButtonGroup vertical>
                        <Button
                          className="py-0"
                          style={spinnerButtonStyle}
                          onClick={(evt) => {
                            evt.stopPropagation()
                            setFieldValue(field.name, increase(field.value, step))
                          }}
                        >
                          <MdArrowDropUp size={20} />
                        </Button>
                        <Button
                          className="py-0"
                          style={spinnerButtonStyle}
                          onClick={(evt) => {
                            evt.stopPropagation()
                            setFieldValue(field.name, decrease(field.value, step))
                          }}
                        >
                          <MdArrowDropDown size={20} />
                        </Button>
                      </ButtonGroup>
                    </Col>
                  </Row>
                )}
              </Field>
              {showError ? <div className="text-danger">{errorMessage}</div> : null}
            </Col>
          </Row>
        </FormGroup>
      )}
    </Field>
  )
}
