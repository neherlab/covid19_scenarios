import React from 'react'

import { useTranslation } from 'react-i18next'
import { Col, Container, Row, Table } from 'reactstrap'
import ReactTooltip from "react-tooltip"
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
const versionNumber = versionString.split('(',1)
const commitHash  = versionString.substring(versionString.indexOf("(")).split(',',1)
const buildNumber = versionString.substring(versionString.indexOf(","))
const versionLink = versionString.substring(8).split('(',1)
const hashLink = versionString.substring(versionString.indexOf((":"))+2).split(',',1)


export default function Footer() {
  const { t } = useTranslation()

  return (
   <Container fluid className="py-3"> 

    <Row noGutters>
        <Col xs={12} md={6} className="text-center text-md-left mb-2 mb-md-0">
            {t('COVID-19 Scenarios (c) 2020 neherlab')}
        </Col>
        <Col xs={12} md={6} className="d-flex justify-content-center justify-content-md-end align-items-center">
          <LinkExternal url={'https://github.com/neherlab/covid19_scenarios/tree/' + versionLink}>
            <small title="This Version's Page on GitHub" className="text-gray-light">{versionNumber}</small>
          </LinkExternal>
         ​
          <LinkExternal url={"https://github.com/neherlab/covid19_scenarios/commit/" + hashLink}>
            <small title="Most Recent Change" className="text-gray-light">{commitHash}</small>
          </LinkExternal>
        ​
          <LinkExternal url="https://github.com/neherlab/covid19_scenarios/releases">
            <small title="Most Recent Release" className="text-gray-light">{buildNumber}</small>
          </LinkExternal>
          
        </Col>
      </Row>
      <Row noGutters>
        <Col className="text-center mb-2 mb-md-0">
          Proudly Powered by
        </Col>  
      </Row>
      <Row noGutters>
        <Table className="w-100 center mx-auto table-layout-fixed">
          <tbody>
            <tr>
              <td className="w-100 text-center">
                <LinkExternal url="https://neherlab.org/" alt="Link to website of NeherLab">
                  <LogoNeherlab viewBox="0 0 354.325 354.325" alt="NeherLab Logo" className="mx-auto" width="50" height="50" />
                </LinkExternal>
              </td>

              <td className="w-100 text-center">
                <LinkExternal url="https://www.biozentrum.unibas.ch/" alt="Link to website of Biozentrum Basel">
                  <LogoBiozentrum viewBox="0 0 88 40" alt="Biozentrum Logo" className="mx-auto" height="50" />
                </LinkExternal>
              </td>

              <td className="w-100 text-center">
                <LinkExternal url="https://www.unibas.ch/en.html" alt="Link to website of University of Basel">
                  <LogoUnibas viewBox="0 0 172 57" alt="Unibas Logo" className="mx-auto" height="50" />
                </LinkExternal>
              </td>
            </tr>
            <tr>
              <td className="w-100 text-center">
                <LinkExternal url="https://docs.github.com/en/github/building-a-strong-community/about-team-discussions" alt="Link to Github Discussions">
	          <LogoGithub viewBox="0 0 100 354.325" alt="Github logo" className="mx-auto" />
                </LinkExternal>
              </td>
              <td className="w-100 text-center">
                <LinkExternal url="https://vercel.com/?utm_source=nextstrain" alt="Link to website of Vercel">
                 <LogoVercel viewBox="0 0 70 90" alt="Vercel logo" className="mx-auto" width="250" height="50" />
                </LinkExternal>  
              </td>
              <td className="w-100 text-center">
                <LinkExternal url="https://doi.org/10.1101/2020.05.05.20091363" alt="Link to website of Github">
	          <LogoMed viewBox="0 0 160 107" alt ="medRxiv Logo" className="mx-auto" width="200" height="50" />
                </LinkExternal>
              </td>
            </tr>
          </tbody>
        </Table>
      </Row>
  </Container>
  )
}
