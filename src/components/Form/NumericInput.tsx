import React from 'react'

import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md'

import { Field } from 'formik'
import { Col, Row, Input, Button, ButtonGroup } from 'reactstrap'

export interface NumericInputProps<T> {
  identifier: string
  label: string
  step?: number | string
  precision?: number
}

export default function NumericInput<T>({
  identifier,
  label,
  step,
  precision,
}: NumericInputProps<T>) {

  const toPrecision : (value:number) => number = (value:number) =>
    Math.round((value + Number.EPSILON) * Math.pow(10, precision)) / Math.pow(10, precision)

    const increase : (value:number) => number = (value:number, step:number) => {
    return toPrecision(value + step)
  }

  const decrease : (value:number) => number = (value:number, step:number) => {
    return toPrecision(value + step)
  }

  const spinnerButtonStyle = {
    'font-size': '0rem',
    'padding': '0',
    'max-width': '1.5rem',
    'max-height': '1.2rem',
  }

  const pattern = "^[-]?[0-9]+([,\.][0-9]+)?"

  return (
    <Field name={identifier}>
      {({ field, form: { setFieldValue, setFieldTouched } }: FieldProps<number>) => (
        <Row noGutters>
          <Col xs={10} sm={10} md={10} lg={10} xl={10}>
            <Input type="text" inputMode="numeric" pattern={pattern} aria-label={label} {...field} />
          </Col>
          <Col xs={2} sm={2} md={2} lg={2} xl={2}>
            <ButtonGroup vertical>
              <Button
                className="py-0"
                style={spinnerButtonStyle}
                onClick={() => {
                  setFieldTouched(field.name, true)
                  setFieldValue(field.name, increase(field.value, step))
                }}
              >
                <MdArrowDropUp size={20} />
              </Button>
              <Button
                className="py-0"
                style={spinnerButtonStyle}
                onClick={() => {
                  setFieldTouched(field.name, true)
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
