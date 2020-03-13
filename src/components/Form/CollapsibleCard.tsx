import React, { useState } from 'react'

import { MdArrowDropDown } from 'react-icons/md'
import { Button, Card, CardBody, CardHeader, Collapse } from 'reactstrap'

import HelpLabel from './HelpLabel'

export interface CollapsibleCardProps {
  identifier: string
  title?: React.ReactNode
  help?: string | React.ReactNode
  children?: React.ReactNode | React.ReactNode[]
  defaultCollapsed?: boolean
}

export function CollapsibleCard({ identifier, title, help, children, defaultCollapsed = true }: CollapsibleCardProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const toggle = () => setCollapsed(!collapsed)

  return (
    <Card className="h-100">
      <CardHeader>
        <Button className="w-100 h-100 text-left p-0" type="button" color="default" onClick={toggle}>
          <div className="d-flex">
            <span className="mx-1 my-auto">
              <MdArrowDropDown size={30} className={`${collapsed ? 'icon-rotate-90' : 'icon-rotate-0'}`} />
            </span>
            <HelpLabel identifier={identifier} label={title} help={help} />
          </div>
        </Button>
      </CardHeader>

      <Collapse isOpen={!collapsed}>
        <CardBody>{children}</CardBody>
      </Collapse>
    </Card>
  )
}
