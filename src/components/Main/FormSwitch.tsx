import React from 'react'

import { CustomInput, FormGroup } from 'reactstrap'

import FormLabel from './FormLabel'

export interface FormInputProps {
  identifier: string
  label: string
  help?: string
  checked: boolean
  onChange(checked: boolean): void
}

export default function FormSwitch({
  identifier,
  label,
  help,
  onChange,
  checked,
}: FormInputProps) {
  return (
    <FormGroup className="my-0">
      <CustomInput
        type="checkbox"
        className="form-control custom-switch"
        id={identifier}
        name={identifier}
        label={<FormLabel identifier={identifier} label={label} help={help} />}
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
    </FormGroup>
  )
}
