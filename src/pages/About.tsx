import React, { Component } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { AboutComponent } from '../components/About';

class About extends Component {
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <AboutComponent />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default About
