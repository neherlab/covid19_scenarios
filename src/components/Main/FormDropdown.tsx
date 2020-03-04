import React from 'react'

import Select from 'react-select'
import { FormGroup } from 'reactstrap'

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
      <label htmlFor={id}>{label}</label>
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
    </FormGroup>
  )
}
