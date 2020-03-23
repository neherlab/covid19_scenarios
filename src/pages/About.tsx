import { importMDX } from 'mdx.macro';
import React, { Component, lazy, Suspense } from 'react';
import { Col, Container, Row } from 'reactstrap';

const Content = lazy(() => importMDX('../assets/text/about.md'));

class Faq extends Component {
  render() {
    return (
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
  }
}

export default Faq
