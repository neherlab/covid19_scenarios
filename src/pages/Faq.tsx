import React from 'react'

import { Col, Container, Row } from 'reactstrap'

import FaqTableOfContents from '../components/Faq/FaqTableOfContents'

import FaqContent from '../assets/text/faq.md'

export default function Faq() {
  return (
    <Container>
      <Row>
        <Col>
          <h1 className="h1-default">Frequently asked questions</h1>
          <FaqTableOfContents />
          <hr />
          <FaqContent />
        </Col>
      </Row>
    </Container>
  )
}
