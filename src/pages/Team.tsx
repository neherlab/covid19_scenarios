import React from 'react'

import { Container, Col, Row } from 'reactstrap'
import { useTranslation } from 'react-i18next'

import ContributorsGenerated from '../components/Team/ContributorsGenerated.mdx'
import CoreTeam from '../components/Team/CoreTeam.mdx'

import './Team.scss'

export default function Team() {
  const { t } = useTranslation()

  return (
    <Container>
      <Row>
        <Col>
          <h1>{t('Team')}</h1>

          <h2>{t('Initial development')}</h2>
          <CoreTeam />

          <h2>{t('Contributors')}</h2>
          <ContributorsGenerated />
        </Col>
      </Row>
    </Container>
  )
}
