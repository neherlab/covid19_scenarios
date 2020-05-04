import React, { ReactNode } from 'react'

import { Card, CardBody, CardHeader } from 'reactstrap'

export interface ScenarioLoaderCardProps {
  header: ReactNode
  children: ReactNode
}

function ScenarioLoaderCard({ header, children }: React.PropsWithChildren<ScenarioLoaderCardProps>) {
  return (
    <Card className="scenario-loader-card">
      <CardHeader className="py-2">{header}</CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  )
}

export { ScenarioLoaderCard }
