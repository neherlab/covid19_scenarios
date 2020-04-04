import React from 'react'

import { Card, CardBody, CardHeader } from 'reactstrap'
import FormLabel from './FormLabel'

export interface CardWithDropdownProps {
  children?: React.ReactNode | React.ReactNode[]
  identifier: string
  label: string | React.ReactNode
  help?: string | React.ReactNode
  onBlur?<T>(e: React.FocusEvent<T>): void
  className?: string
}

export function CardWithoutDropdown({ children, className, identifier, label, help, onBlur }: CardWithDropdownProps) {
  return (
    <Card className={`h-100 ${className || ''}`}>
      <CardHeader className="py-1 px-2">
        <FormLabel identifier={identifier} label={label} help={help} />
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  )
}
