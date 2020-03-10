import React from 'react'

import Select from 'react-select'
import { Col, FormGroup, Row } from 'reactstrap'

export interface FormDropdownOption<ValueType extends string | number> {
  value: ValueType
  label: string
}

export interface FormDropdownProps<ValueType extends string | number> {
  id: string
  label: string
  options: FormDropdownOption<ValueType>[]
  defaultOption?: FormDropdownOption<ValueType>
  value?: FormDropdownOption<ValueType>
  onValueChange?(value: ValueType): void
  onOptionChange?(option: FormDropdownOption<ValueType>): void
  onBlur?<T>(e: React.FocusEvent<T>): void
}

export default function FormDropdownStateless<
  ValueType extends string | number
>({
  id,
  label,
  options,
  defaultOption,
  value,
  onValueChange,
  onOptionChange,
  onBlur,
}: FormDropdownProps<ValueType>) {
  return (
    <FormGroup>
      <Row>
        <Col xl={7}>
          <label htmlFor={id}>{label}</label>
        </Col>
        <Col xl={5}>
          <Select
            id={id}
            name={id}
            options={options}
            defaultValue={defaultOption}
            value={value}
            theme={theme => ({
              ...theme,
              borderRadius: 0,
            })}
            onChange={(option: FormDropdownOption<ValueType>) => {
              onValueChange?.(option.value)
              onOptionChange?.(option)
            }}
            onBlur={onBlur}
          />
        </Col>
      </Row>
    </FormGroup>
  )
}
