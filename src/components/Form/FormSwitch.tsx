import React from 'react'

import { CustomInput } from 'reactstrap'

import FormLabel from './FormLabel'

export interface FormSwitchProps {
  identifier: string
  label: string
  help?: string
  checked: boolean
  hidden?: boolean
  onValueChanged(checked: boolean): void
}

export default function FormSwitch({
  identifier,
  label,
  help,
  onValueChanged,
  checked,
  hidden = false,
  ...props
}: FormSwitchProps) {
  return (
    <CustomInput
      type="checkbox"
      className="form-control custom-switch"
      id={identifier}
      name={identifier}
      label={<FormLabel identifier={identifier} label={label} help={help} />}
      checked={checked}
      onChange={(e) => onValueChanged(e.target.checked)}
      {...props}
    />
  )
}
