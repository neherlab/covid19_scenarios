import React, { useState } from 'react'

import { MdArrowDropDown } from 'react-icons/md'
import { Card, CardBody, CardHeader, Collapse } from 'reactstrap'

import HelpLabel from './HelpLabel'

export interface CollapsibleCardProps {
  identifier: string
  title?: React.ReactNode
  subtitle?: React.ReactNode
  help?: string | React.ReactNode
  children?: React.ReactNode | React.ReactNode[]
  defaultCollapsed?: boolean
}

export function CollapsibleCard({
  identifier,
  title,
  subtitle,
  help,
  children,
  defaultCollapsed = true,
}: CollapsibleCardProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  const toggle = () => setCollapsed(!collapsed)

  return (
    <Card className="h-100">
      <CardHeader onClick={toggle} color="primary">
        <div className="d-flex flex-row align-items-center text-left p-0">
          <MdArrowDropDown size={30} className={`${collapsed ? 'icon-rotate-90' : 'icon-rotate-0'}`} />
          <HelpLabel identifier={identifier} label={title} help={help} subtitle={subtitle} />
        </div>
      </CardHeader>

      <Collapse isOpen={!collapsed}>
        <CardBody>{children}</CardBody>
      </Collapse>
    </Card>
  )
}
