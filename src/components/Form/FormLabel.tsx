import React from 'react'

import HelpLabel from './HelpLabel'

export interface LabelWithHelpButtonProps {
  identifier: string
  label: string | React.ReactNode
  help?: string | React.ReactNode
}

export default function FormLabel({ identifier, label, help }: LabelWithHelpButtonProps) {
  return (
    <label htmlFor={identifier} className="d-flex">
      <HelpLabel identifier={identifier} label={label} help={help} />
    </label>
  )
}
