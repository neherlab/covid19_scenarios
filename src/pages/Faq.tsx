import React from 'react'

import { useTranslation } from 'react-i18next'
import { Col, Container, Row } from 'reactstrap'

import FaqTableOfContents from '../components/Faq/FaqTableOfContents'

import FaqContent from '../assets/text/faq.mdx'

export default function Faq() {
  const { t } = useTranslation()

  return (
    <Container>
      <Row>
        <Col>
          <h1 className="h1-default">{t('Frequently asked questions')}</h1>
          <FaqTableOfContents />
          <hr />
          <FaqContent />
        </Col>
      </Row>
    </Container>
  )
}
