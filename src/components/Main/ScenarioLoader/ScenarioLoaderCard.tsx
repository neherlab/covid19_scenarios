import React, { ReactNode } from 'react'

import c from 'classnames'
import type { CardProps } from 'reactstrap'
import { Card, CardBody, CardHeader } from 'reactstrap'

export interface ScenarioLoaderCardProps extends CardProps {
  header: ReactNode
  children: ReactNode
}

function ScenarioLoaderCard({
  header,
  children,
  className,
  ...restProps
}: React.PropsWithChildren<ScenarioLoaderCardProps>) {
  return (
    <Card className={c('scenario-loader-card', className)} {...restProps}>
      <CardHeader className="py-2">{header}</CardHeader>
      <CardBody className="h-100">{children}</CardBody>
    </Card>
  )
}

export { ScenarioLoaderCard }
