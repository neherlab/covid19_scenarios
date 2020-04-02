import React from 'react'

import FormHelpButton, { HelpProps } from './FormHelpButton'

export interface HelpLabelProps {
  identifier: string
  label: string | React.ReactNode
  help?: HelpProps
}

export default function HelpLabel({ identifier, label, help }: HelpLabelProps) {
  return (
    <div className="d-flex align-items-center">
      <span className="my-auto text-truncate">{label}</span>
      <FormHelpButton identifier={`${identifier}_help`} help={help} />
    </div>
  )
}
