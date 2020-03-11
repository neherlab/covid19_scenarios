import React from 'react'

import { CustomInput, FormGroup } from 'reactstrap'

export interface FormInputProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string
  label: string
  checked: boolean
  hidden?: boolean
  onValueChanged(checked: boolean): void
}

export default function FormSwitch({
  id,
  label,
  onValueChanged,
  checked,
  hidden = false,
  ...props
}: FormInputProps) {
  return (
    <CustomInput
      type="checkbox"
      className="custom-switch"
      id={id}
      name={id}
      label={<label htmlFor={id}>{label}</label>}
      checked={checked}
      onChange={e => onValueChanged(e.target.checked)}
      {...props}
    />
  )
}
