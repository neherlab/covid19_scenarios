import React, { useState } from 'react'

import { MdArrowDropDown } from 'react-icons/md'
import { Button, Card, CardBody, CardHeader, Collapse } from 'reactstrap'

export interface CollapsibleCardProps {
  title?: React.ReactNode
  children?: React.ReactNode | React.ReactNode[]
  defaultCollapsed?: boolean
}

export function CollapsibleCard({
  title,
  children,
  defaultCollapsed = true,
}: CollapsibleCardProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const toggle = () => setCollapsed(!collapsed)

  return (
    <Card className="h-100">
      <CardHeader>
        <Button
          className="w-100 h-100 text-left p-0"
          type="button"
          color="default"
          onClick={toggle}
        >
          <div className="d-flex">
            <span className="mx-1 my-auto">
              <MdArrowDropDown
                size={30}
                className={`${collapsed ? 'icon-rotate-90' : 'icon-rotate-0'}`}
              />
            </span>
            <span>{title}</span>
          </div>
        </Button>
      </CardHeader>

      <Collapse isOpen={!collapsed}>
        <CardBody>{children}</CardBody>
      </Collapse>
    </Card>
  )
}
