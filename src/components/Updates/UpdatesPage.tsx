import React from 'react'

import { Col, Container, Row } from 'reactstrap'

import UpdatesContent from './UpdatesContent.md'

export function UpdatesPage() {
  return (
    <Container>
      <Row>
        <Col>
          <h1>Updates to model</h1>
          <UpdatesContent />
        </Col>
      </Row>
    </Container>
  )
}
