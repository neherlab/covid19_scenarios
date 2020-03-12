import React from 'react'

import FormHelpButton from './FormHelpButton'

export interface LabelWithHelpButtonProps {
  identifier: string
  label: string | React.ReactNode
  help?: string | React.ReactNode
}

export default function FormLabel({
  identifier,
  label,
  help,
}: LabelWithHelpButtonProps) {
  return (
    <label htmlFor={identifier} className="d-flex">
      <span className="my-auto">
        <FormHelpButton
          identifier={`${identifier}_help`}
          label={label}
          help={help}
        />
      </span>
      <span className="ml-2 my-auto text-truncate">{label}</span>
    </label>
  )
}
