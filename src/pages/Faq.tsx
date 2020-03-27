import { importMDX } from 'mdx.macro'
import React, { lazy, Suspense } from 'react'
import { Col, Container, Row } from 'reactstrap'

const Content = lazy(() => importMDX('../assets/text/faq.md'))

const Faq = () => (
  <Container>
    <Row>
      <Col>
        <Suspense fallback={<div>Loading...</div>}>
          <Content />
        </Suspense>
      </Col>
    </Row>
  </Container>
)

export default Faq
