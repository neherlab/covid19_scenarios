import React from 'react'

import { Col, Container, Row } from 'reactstrap'
import { useTranslation } from 'react-i18next'

import UpdatesContent from './UpdatesContent.md'

export function UpdatesPage() {
  const { t } = useTranslation()

  return (
    <Container>
      <Row>
        <Col>
          <h1>{t('Updates to model')}</h1>
          <UpdatesContent />
        </Col>
      </Row>
    </Container>
  )
}
