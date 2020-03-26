import React from 'react'
import { Container, Col, Row } from 'reactstrap'

import { useTranslation } from 'react-i18next'

import Status from '../components/Router/Status'

import './NotFound.scss'

function NotFound() {
  const { t } = useTranslation()
  return (
    <Status code={404}>
      <Container>
        <Row>
          <Col>
            <h1 className="h1-notfound">{t('Not found')}</h1>
            <h3 className="text-center h3-notfound">{t('Ooops! This page does not exist')}</h3>
          </Col>
        </Row>
      </Container>
    </Status>
  )
}

export default NotFound
