import React from 'react'
import { Card, CardBody, CardHeader, Row, Col } from 'reactstrap'
import FormLabel from './FormLabel'

export interface CardWithControlsProps extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode | React.ReactNode[]
  constrolsComponent?: React.ReactNode | React.ReactNode[]
  className?: string
  identifier: string
  labelComponent: string | React.ReactNode
  help?: string | React.ReactNode
  onBlur?<T>(e: React.FocusEvent<T>): void
}

export function CardWithControls({
  children,
  constrolsComponent,
  className,
  identifier,
  labelComponent,
  help,
  ref,
  ...restProps
}: CardWithControlsProps) {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    <Card ref={ref} className={className ?? ''} {...restProps}>
      <CardHeader className="py-1 px-2">
        <Row>
          <Col lg={7}>
            <FormLabel identifier={identifier} label={labelComponent} help={help} />
          </Col>
          <Col lg={3} className="ml-auto text-right">
            {constrolsComponent}
          </Col>
        </Row>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  )
}
