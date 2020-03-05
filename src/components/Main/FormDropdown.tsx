import React from 'react'

import Select from 'react-select'
import Downshift from 'downshift'
import { FormGroup, Col, Row } from 'reactstrap'

export interface FormDropdownOption {
  value: string
  label: string
}

export interface FormDropdownProps {
  id: string
  label: string
  options: FormDropdownOption[]
  defaultOption?: FormDropdownOption
  onChange(value: string): void
}

export default function FormDropdown({
  id,
  label,
  options,
  defaultOption,
  onChange,
}: FormDropdownProps) {
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
        theme={theme => ({
          ...theme,
          borderRadius: 0,
        })}
        onChange={(option: FormDropdownOption) => onChange(option.value)}
      />
      </Col>
      </Row>
    </FormGroup>
  )
}
