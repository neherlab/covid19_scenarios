import React from 'react'

import { Card, CardBody, CardHeader, Row, Col } from 'reactstrap'
import classNames from 'classnames'

import FormLabel from './FormLabel'

export interface CardWithControlsProps extends React.PropsWithChildren<React.HTMLProps<HTMLDivElement>> {
  controlsComponent?: React.ReactNode | React.ReactNode[]
  identifier: string
  labelComponent: string | React.ReactNode
  help?: string | React.ReactNode
  onBlur?<T>(e: React.FocusEvent<T>): void
}

export function CardWithControls({
  className,
  children,
  controlsComponent,
  identifier,
  labelComponent,
  help,
  ref,
  ...restProps
}: CardWithControlsProps) {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    <Card itemRef={ref} className={classNames(className, 'card-with-controls')} {...restProps}>
      <CardHeader className="card-with-controls-header">
        <Row>
          <Col lg={8} className="d-flex">
            <FormLabel identifier={identifier} label={labelComponent} help={help} />
          </Col>
          <Col lg={3} className="ml-auto text-right px-0">
            {controlsComponent}
          </Col>
        </Row>
      </CardHeader>
      <CardBody className="card-with-controls-body">{children}</CardBody>
    </Card>
  )
}
