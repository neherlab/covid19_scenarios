import React from 'react'
import { Container, Col, Row } from 'reactstrap'
import { useTranslation } from 'react-i18next'

import './About.scss'

import LinkExternal from '../components/Router/LinkExternal'

const Team: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Container>
      <Row>
        <Col>
          <h1 className="h1-about">{t('The people behind COVID-19 Scenarios')}</h1>
          <p>
            {t('This tool was developed at the University of Basel in the')}
            <LinkExternal url="https://neherlab.org">&nbsp;{t('Research group')}&nbsp;</LinkExternal>
            {t('of Richard Neher by')}
          </p>
          <ul>
            <li>Ivan Aksamentov</li>
            <li>Nicholas Noll</li>
            <li>Richard Neher</li>
          </ul>
          <LinkExternal url="https://ki.se/en/mtc/jan-albert-group">Jan Albert</LinkExternal>
          &nbsp;{' '}
          {t(
            'at the Karolinska hospital in Stockholm had the initial idea to develop this tool and suggested features and parameters.',
          )}{' '}
          Jan {t('and')} Robert Dyrdak {t('provided parameter estimates.')}
        </Col>
      </Row>
    </Container>
  )
}

export default Team
