import React from 'react'

import { Container, Col, Row } from 'reactstrap'
import { useTranslation } from 'react-i18next'

import CoreTeam from './CoreTeam.mdx'
import ContributorsGenerated from './ContributorsGenerated.mdx'

export function TeamPage() {
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

          <h2>{t('Support')}</h2>

          <p>{t('We want to thank the companies that reached out and helped us to build this tool:')}</p>

          <p>
            {t(`Vercel (previously known as ZEIT) sponsored to build and host all of your pull requests on their now.sh platform.
             This has helped us enormously, especially when working with external collaborators`)}
          </p>

          <p>{t('Github kindly allowed us to use their new Discussions feature')}</p>
        </Col>
      </Row>
    </Container>
  )
}
