import React from 'react'

import { useTranslation } from 'react-i18next'
import { Col, Container, Row, Table } from 'reactstrap'
import { getVersionString } from '../../helpers/getVersionString'

import './Footer.scss'
import LinkExternal from '../Router/LinkExternal'

import { ReactComponent as LogoNeherlab } from '../../assets/img/neherlab.svg'
import { ReactComponent as LogoBiozentrum } from '../../assets/img/biozentrum.svg'
import { ReactComponent as LogoUnibas } from '../../assets/img/unibas.svg'
import { ReactComponent as LogoVercel } from '../../assets/img/vercel.svg'
import { ReactComponent as LogoGithub } from '../../assets/img/github.svg'
import { ReactComponent as LogoMed } from '../../assets/img/medrxiv.svg'

const versionString = getVersionString()
const versionNumber = versionString.split('(', 1)
const commitHash = versionString.slice(Math.max(0, versionString.indexOf('('))).split(',', 1)[0]
const buildNumber = versionString.slice(Math.max(0, versionString.indexOf(',')))
const versionLink = versionString.slice(8).split('(', 1)[0]
const hashLink = versionString.slice(Math.max(0, versionString.indexOf(':') + 2)).split(',', 1)[0]

export default function Footer() {
  const { t } = useTranslation()

  return (
    <Container fluid className="py-3">
      <Row noGutters>
        <Col xs={12} md={6} className="text-center text-md-left mb-2 mb-md-0">
          {t('COVID-19 Scenarios (c) 2020 neherlab')}
        </Col>
        <Col xs={12} md={6} className="d-flex justify-content-center justify-content-md-end align-items-center">
          <LinkExternal url={`https://github.com/neherlab/covid19_scenarios/tree/${versionLink}`}>
            <small title="This Version's Page on GitHub" className="text-gray-light">
              {versionNumber}
            </small>
          </LinkExternal>

          <LinkExternal url={`https://github.com/neherlab/covid19_scenarios/commit/${hashLink}`}>
            <small title="Most Recent Change" className="text-gray-light">
              {commitHash}
            </small>
          </LinkExternal>

          <LinkExternal url="https://github.com/neherlab/covid19_scenarios/releases">
            <small title="Most Recent Release" className="text-gray-light">
              {buildNumber}
            </small>
          </LinkExternal>
        </Col>
      </Row>
      <Row noGutters>
        <Col className="text-center mb-2 mb-md-0">Proudly Powered by</Col>
      </Row>
      <Row noGutters>
        <Table className="w-100 center mx-auto table-layout-fixed">
          <tbody>
            <tr>
              <td className="w-100 text-center">
                <LinkExternal url="https://neherlab.org/" alt="Link to website of NeherLab">
                  <LogoNeherlab viewBox="0 0 354.325 354.325" className="mx-auto" width="50" height="50" />
                </LinkExternal>
              </td>

              <td className="w-100 text-center">
                <LinkExternal url="https://www.biozentrum.unibas.ch/" alt="Link to website of Biozentrum Basel">
                  <LogoBiozentrum viewBox="0 0 88 40" className="mx-auto" height="50" />
                </LinkExternal>
              </td>

              <td className="w-100 text-center">
                <LinkExternal url="https://www.unibas.ch/en.html" alt="Link to website of University of Basel">
                  <LogoUnibas viewBox="0 0 172 57" className="mx-auto" height="50" />
                </LinkExternal>
              </td>
            </tr>
            <tr>
              <td className="w-100 text-center">
                <LinkExternal
                  url="https://docs.github.com/en/github/building-a-strong-community/about-team-discussions"
                  alt="Link to Github Discussions"
                >
                  <LogoGithub viewBox="0 0 24 24" className="mx-auto" height="50" />
                </LinkExternal>
              </td>

              <td className="w-100 text-center">
                <LinkExternal url="https://vercel.com/?utm_source=nextstrain" alt="Link to website of Vercel">
                  <LogoVercel viewBox="0 0 212 44" className="mx-auto" width="150" height="50" />
                </LinkExternal>
              </td>

              <td className="w-100 text-center">
                <LinkExternal url="https://doi.org/10.1101/2020.05.05.20091363" alt="Link to website of Github">
                  <LogoMed viewBox="0 0 300 89" className="mx-auto" width="175" height="50" />
                </LinkExternal>
              </td>
            </tr>
          </tbody>
        </Table>
      </Row>
    </Container>
  )
}
