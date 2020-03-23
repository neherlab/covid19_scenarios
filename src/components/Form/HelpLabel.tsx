import React from 'react'

import FormHelpButton from './FormHelpButton'

export interface HelpLabelProps {
  identifier: string
  label: string | React.ReactNode
  help?: string | React.ReactNode
}

export default function HelpLabel({ identifier, label, help }: HelpLabelProps) {
  return (
    <div className="d-flex align-items-center">
      <FormHelpButton identifier={`${identifier}_help`} label={label} help={help} />
      <span className="ml-2 my-auto text-truncate">{label}</span>
    </div>
  )
}
