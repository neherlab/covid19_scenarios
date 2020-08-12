import React from 'react'
import { Container, Col, Row } from 'reactstrap'

import { useTranslation } from 'react-i18next'

export function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <Container>
      <Row>
        <Col>
          <h1 className="h1-notfound">{t('Not found')}</h1>
          <h3 className="text-center h3-notfound">{t('This page does not exist')}</h3>
        </Col>
      </Row>
    </Container>
  )
}
