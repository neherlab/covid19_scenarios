import React from 'react'
import { Col, Row } from 'reactstrap'

import './About.scss'

import LinkExternal from '../components/Router/LinkExternal'

const Team: React.FC = () => {
  return (
    <>
      <h1 className="h1-about">{'The people behind COVID-19 Scenarios'}</h1>
      <Row>
        <Col lg={2} />
        <Col lg={8}>
          <p>
            This tool was developed at the University of Basel in the
            <LinkExternal url="https://neherlab.org">&nbsp;research group&nbsp;</LinkExternal>
            of Richard Neher by
          </p>
          <ul>
            <li>Ivan Aksamentov</li>
            <li>Nicholas Noll</li>
            <li>Richard Neher</li>
          </ul>
          <LinkExternal url="https://ki.se/en/mtc/jan-albert-group">Jan Albert</LinkExternal>
          &nbsp; at the Karolinska hospital in Stockholm had the initial idea to develop this tool and suggested
          features and parameters. Jan and Robert Dyrdak provided parameter estimates.
        </Col>
        <Col lg={2} />
      </Row>
    </>
  )
}

export default Team
