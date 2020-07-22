import React from 'react'

import { useTranslation } from 'react-i18next'
import { Col, Container, Row, Table } from 'reactstrap'
import ReactTooltip from "react-tooltip"
import { getVersionString } from '../../helpers/getVersionString'

import './Footer.scss'
import { ReactComponent as LogoNeherlab } from '../../assets/img/neherlab.svg'
import { ReactComponent as LogoBiozentrum } from '../../assets/img/biozentrum.svg'
import { ReactComponent as LogoUnibas } from '../../assets/img/unibas.svg'
import Vercel from './vercel.png'
import Github from './github.png'
import Med from './medRxiv.png'
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
          <a href={'https://github.com/neherlab/covid19_scenarios/tree/' + versionLink}>
            <small data-tip data-for="versiontip" className="text-gray-light">{versionNumber}</small>
          </a>
          <ReactTooltip id="versiontip" place="top" effect="solid">
            This Version's Page on GitHub
          </ReactTooltip>
​
​
          <a href={"https://github.com/neherlab/covid19_scenarios/commit/" + hashLink}>
            <small data-tip data-for="committip" className="text-gray-light">{commitHash}</small>
          </a>
          <ReactTooltip id="committip" place="top" effect="solid">
            Most Recent Change
          </ReactTooltip>
​
          <a href="https://github.com/neherlab/covid19_scenarios/releases">
            <small className="text-gray-light">{buildNumber}</small>
          </a>
          <ReactTooltip id="committip" place="top" effect="solid">
            Most Recent Change
          </ReactTooltip>
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
                <a href = "https://neherlab.org/" alt="Link to website of NeherLab">
                  <LogoNeherlab viewBox="0 0 354.325 354.325" className="mx-auto" width="50" height="50" />
                </a>
              </td>

              <td className="w-100 text-center">
                <a href="https://www.biozentrum.unibas.ch/" alt="Link to website of Biozentrum Basel">
                  <LogoBiozentrum viewBox="0 0 88 40" className="mx-auto" height="50" />
                </a>
              </td>

              <td className="w-100 text-center">
                <a href="https://www.unibas.ch/en.html" alt="Link to website of University of Basel">
                  <LogoUnibas viewBox="0 0 172 57" className="mx-auto" height="50" />
                </a>
              </td>
            </tr>
            <tr>
              <td className="w-100 text-center">
                <a href ="https://docs.github.com/en/github/building-a-strong-community/about-team-discussions" alt="Link to Github Discussions">
	          <img src={Github} alt='Github logo' width = '50' height = '50'/>
                </a>
              </td>
              <td className="w-100 text-center">
                <a href ="https://vercel.com/" alt="Link to website of Vercel">
                  <img src={Vercel} alt='Vercel logo' width = '50' height = '50'/>
                </a>  
              </td>
              <td className="w-100 text-center">
                <a href ="https://doi.org/10.1101/2020.05.05.20091363" alt="Link to website of Github">
	          <img src={Med} alt='medRxiv logo' width = '100' height = '50'/>
                </a>
              </td>
            </tr>
          </tbody>
        </Table>
      </Row>
  </Container>
  )
}
