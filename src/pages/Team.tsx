import React from 'react'
import { Col, Row } from 'reactstrap'
import { useTranslation } from 'react-i18next'

import './About.scss'

import LinkExternal from '../components/Router/LinkExternal'

const Team: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <h1 className="h1-about">{t('The people behind COVID-19 Scenarios')}</h1>
      <Row>
        <Col lg={2} />
        <Col lg={8}>
          <p>
            {t('This tool was developed at the university of basel in the')}
            <LinkExternal url="https://neherlab.org">&nbsp;{t('Research group')}&nbsp;</LinkExternal>
            {t('Of richard neher by')}
          </p>
          <ul>
            <li>Ivan Aksamentov</li>
            <li>Nicholas Noll</li>
            <li>Richard Neher</li>
          </ul>
          <LinkExternal url="https://ki.se/en/mtc/jan-albert-group">Jan Albert</LinkExternal>
          &nbsp; {t('at the karolinska hospital in stockholm had the initial idea to develop this tool and suggested features and parameters')} Jan {t('and')} Robert Dyrdak {t('provided parameter estimates')}
        </Col>
        <Col lg={2} />
      </Row>
    </>
  )
}

export default Team
