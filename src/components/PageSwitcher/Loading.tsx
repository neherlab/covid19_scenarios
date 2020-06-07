import React from 'react'

import { Container, Row, Col } from 'reactstrap'

import { useTranslation } from 'react-i18next'

function Loading() {
  const { t } = useTranslation()
  return (
    <Container>
      <Row>
        <Col>
          <div className="loading-page d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">{t('Loading...')}</span>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Loading
