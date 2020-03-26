import React from 'react'

import { Card, CardBody, CardHeader } from 'reactstrap'
import FormLabel from './FormLabel'

export interface CardWithDropdownProps {
  children?: React.ReactNode | React.ReactNode[]
  identifier: string
  label: string | React.ReactNode
  help?: string | React.ReactNode
  onBlur?<T>(e: React.FocusEvent<T>): void
}

export function CardWithoutDropdown({ children, identifier, label, help, onBlur }: CardWithDropdownProps) {
  return (
    <Card className="h-100">
      <CardHeader className="p-1">
        <FormLabel identifier={identifier} label={label} help={help} />
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  )
}
