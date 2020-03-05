import React from 'react'

import { CustomInput, FormGroup } from 'reactstrap'

export interface FormInputProps {
  id: string
  label: string
  checked: boolean
  onChange(checked: boolean): void
}

export default function FormSwitch({
  id,
  label,
  onChange,
  checked,
}: FormInputProps) {
  return (
    <FormGroup>
      <CustomInput
        type="checkbox"
        className="form-control custom-switch"
        id={id}
        name={id}
        label={<label htmlFor={id}>{label}</label>}
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
    </FormGroup>
  )
}
