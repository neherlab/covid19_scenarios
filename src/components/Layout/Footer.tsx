import React from 'react'

import { useTranslation } from 'react-i18next'
import { Col, Container, Row } from 'reactstrap'

import { getVersionString } from '../../helpers/getVersionString'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <Container fluid className="py-3">
      <Row noGutters>
        <Col xs={12} md={6} className="text-center text-md-left mb-2 mb-md-0">
          {t('COVID-19 Scenarios (c) 2020 neherlab')}
        </Col>
        <Col xs={12} md={6} className="d-flex justify-content-center justify-content-md-end align-items-center">
          <small className="text-gray-light">{getVersionString()}</small>
        </Col>
      </Row>
    </Container>
  )
}
