import React from 'react'

import { Field, FieldProps } from 'formik'

import { Col, Row, Input, Button, ButtonGroup } from 'reactstrap'

import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md'

export interface MitigationValueInputProps {
  identifier: string
  value: number
  min: number
  max: number
  step: number
  precision: number
}

export function MitigationValueInput({ identifier, value, min, max, step, precision }: MitigationValueInputProps) {
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
    <Field name={identifier} className="form-control">
      {({ field, form: { setFieldValue, setFieldTouched } }: FieldProps<number>) => (
        <Row noGutters>
          <Col xs={10} sm={10} md={10} lg={10} xl={10}>
            <Input type="text" inputMode="numeric" pattern="[0-9]*" aria-label="mitigation value" {...field} />
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
  )
}
