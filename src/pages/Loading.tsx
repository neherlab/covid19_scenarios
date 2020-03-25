import React from 'react'
import { Container, Col, Row } from 'reactstrap'

import './Loading.scss'

import { useTranslation } from 'react-i18next'

function Loading() {
  const { t } = useTranslation()
  return (
    <Container>
      <Row>
        <Col>
          <h1 className="h1-loading">{t('Loading...')}</h1>
        </Col>
      </Row>
    </Container>
  )
}

export default Loading
