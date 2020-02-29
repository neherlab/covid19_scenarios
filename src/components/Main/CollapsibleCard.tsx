import React, { useState } from 'react'

import { Button, Card, CardBody, CardHeader, Collapse } from 'reactstrap'
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa'

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
    <Card>
      <CardHeader>
        <Button type="button" color="default" onClick={toggle}>
          <span style={{ marginRight: '5px' }}>
            {collapsed ? <FaPlusCircle /> : <FaMinusCircle />}
          </span>
          <span>{title}</span>
        </Button>
      </CardHeader>

      <Collapse isOpen={!collapsed}>
        <CardBody>{children}</CardBody>
      </Collapse>
    </Card>
  )
}
