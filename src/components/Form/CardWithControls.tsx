import React from 'react'
import { Card, CardBody, CardHeader, Row, Col } from 'reactstrap'
import FormLabel from './FormLabel'
import './CardWithControls.scss'

export interface CardWithControlsProps {
  children?: React.ReactNode | React.ReactNode[]
  controls?: React.ReactNode | React.ReactNode[]
  className?: string
  identifier: string
  label: string | React.ReactNode
  help?: string | React.ReactNode
  onBlur?<T>(e: React.FocusEvent<T>): void
}

export function CardWithControls({ children, controls, className, identifier, label, help }: CardWithControlsProps) {
  return (
    <Card className={`h-100 ${className || ''}`}>
      <CardHeader className="py-1 px-2">
        <Row>
          <Col l={12} xl={7}>
            <FormLabel identifier={identifier} label={label} help={help} />
          </Col>
          <Col x={12} xl={5} className="card-header-row-controls">
            {controls}
          </Col>
        </Row>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  )
}
