import React from 'react'

import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md'

import { Field } from 'formik'
import { InputGroup, InputGroupAddon, Input, Button, ButtonGroup } from 'reactstrap'

export interface NumericInputProps<T> {
  identifier: string
  label: string
  step: number
  precision: number
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
    return toPrecision(parseFloat(value) + step)
  }

  const decrease : (value:number) => number = (value:number, step:number) => {
    return toPrecision(parseFloat(value) - step)
  }

  const spinnerButtonStyle = {
    'fontSize': '0rem',
    'padding': '0',
    'maxWidth': '1.5rem',
    'maxHeight': '1.2rem',
    'margin': '0',
    'zIndex':'inherit'
  }

  const inputStyle = {
    'textOverflow':'ellipsis'
  }

  const pattern = "^[-]?[0-9]+([,\.][0-9]+)?"

  return (
      <Field name={identifier}>
        {({ field, form: { setFieldValue, setFieldTouched } }: FieldProps<number>) => (
          <InputGroup>
            <Input type="text" inputMode="numeric" pattern={pattern} aria-label={label} style={inputStyle} {...field} />
            <InputGroupAddon addonType="append">
              <ButtonGroup vertical>
                <Button
                  style={spinnerButtonStyle}
                  onClick={() => {
                    setFieldTouched(field.name, true)
                    setFieldValue(field.name, increase(field.value, step))
                  }}
                >
                  <MdArrowDropUp size={20} />
                </Button>
                <Button
                  style={spinnerButtonStyle}
                  onClick={() => {
                    setFieldTouched(field.name, true)
                    setFieldValue(field.name, decrease(field.value, step))
                  }}
                >
                  <MdArrowDropDown size={20} />
                </Button>
              </ButtonGroup>
            </InputGroupAddon>
          </InputGroup>
        )}
      </Field>
  )
}