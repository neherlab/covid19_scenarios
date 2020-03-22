import React from 'react'

import FormHelpButton from './FormHelpButton'

export interface HelpLabelProps {
  identifier: string
  label: string | React.ReactNode
  subtitle?: string | React.ReactNode
  help?: string | React.ReactNode
}

export default function HelpLabel({ identifier, label, help, subtitle }: HelpLabelProps) {
  return (
    <>
      <FormHelpButton identifier={`${identifier}_help`} label={label} help={help} />
      <div className="flex-column ml-2">
        {label}
        {subtitle}
      </div>
    </>
  )
}
