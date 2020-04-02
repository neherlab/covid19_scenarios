import React, { useState } from 'react'

import { MdArrowDropDown } from 'react-icons/md'
import { Card, CardBody, CardHeader, Collapse } from 'reactstrap'

import HelpLabel from './HelpLabel'

export interface CollapsibleCardProps {
  identifier: string
  title?: React.ReactNode
  help?: string | React.ReactNode
  children?: React.ReactNode | React.ReactNode[]
  defaultCollapsed?: boolean
  className?: string
}

export function CollapsibleCard({
  className,
  identifier,
  title,
  help,
  children,
  defaultCollapsed = true,
}: CollapsibleCardProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const toggle = () => setCollapsed(!collapsed)

  return (
    <Card className={`h-100 ${className || ''}`}>
      <CardHeader className="py-1 px-2" onClick={toggle}>
        <div className="w-100 h-100 text-left p-0" color="default">
          <div className="d-flex">
            <span className="mx-1 my-auto">
              <MdArrowDropDown size={30} className={`${collapsed ? 'icon-rotate-90' : 'icon-rotate-0'}`} />
            </span>
            <HelpLabel identifier={identifier} label={title} help={help} />
          </div>
        </div>
      </CardHeader>

      <Collapse isOpen={!collapsed}>
        <CardBody>{children}</CardBody>
      </Collapse>
    </Card>
  )
}
