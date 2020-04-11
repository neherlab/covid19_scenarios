import React from 'react'

import { Col, Container, Row } from 'reactstrap'

import { getVersionString } from '../../helpers/getVersionString'

import './Footer.scss'

export default function Footer() {
  return (
    <Container fluid>
      <Row noGutters>
        <Col md={6}>{'COVID-19 Scenarios (c) 2020 neherlab'}</Col>
        <Col md={6} className="d-flex">
          <small className="ml-auto text-gray-light">{getVersionString()}</small>
        </Col>
      </Row>
    </Container>
  )
}
