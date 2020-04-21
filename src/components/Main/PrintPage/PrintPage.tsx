import React from 'react'

import _ from 'lodash'
import moment from 'moment'
import { Button, Col, Container, Row, Table } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { FaWindowClose } from 'react-icons/fa'

import { AllParams, EmpiricalData, Severity } from '../../../algorithms/types/Param.types'
import { AlgorithmResult } from '../../../algorithms/types/Result.types'
import { DeterministicLinePlot } from '../Results/DeterministicLinePlot'
import { OutcomeRatesTable } from '../Results/OutcomeRatesTable'
import { AgeBarChart } from '../Results/AgeBarChart'
import TableResult from './TableResult'
import { dateFormat, dateTimeFormat } from './dateFormat'

import LinkExternal from '../../Router/LinkExternal'

import PrintIntroduction from './PrintIntroduction.mdx'
import PrintDisclaimer from './PrintDisclaimer.mdx'

import logoNeherlab from '../../../assets/img/neherlab.svg'
import logoBiozentrum from '../../../assets/img/biozentrum.svg'
import logoUnibas from '../../../assets/img/unibas.svg'

import './PrintPage.scss'

interface PropsType {
  params: AllParams
  scenarioUsed: string
  severity: Severity[]
  result?: AlgorithmResult
  caseCounts?: EmpiricalData
  onClose: () => void
}

const months = moment.months()

const parameterExplanations = {
  cases: 'Case counts for',
  country: 'Age distribution for',
  populationServed: 'Population size',
  hospitalBeds: 'Number of hospital beds',
  ICUBeds: 'Number of available ICU beds',
  importsPerDay: 'Cases imported into community per day',
  initialNumberOfCases: 'Number of cases at the start of the simulation',
  infectiousPeriod: 'Infectious period [days]',
  latencyTime: 'Latency [days]',
  lengthHospitalStay: 'Average time in regular ward [days]',
  lengthICUStay: 'Average time in ICU ward [days]',
  overflowSeverity: 'Increase in death rate when ICUs are overcrowded',
  r0: 'R0 at the beginning of the outbreak',
  seasonalForcing: 'Seasonal variation in transmissibility',
  peakMonth: 'Seasonal peak in transmissibility',
}

export default function PrintPage({ params, scenarioUsed, severity, result, caseCounts, onClose }: PropsType) {
  const { t } = useTranslation()
  if (result && caseCounts) {
    return (
      <Container className="container-print" style={{ maxWidth: '20cm' }}>
        <Row className="d-print-none">
          <Col className="w-100 d-flex">
            <Button className="mr-auto" onClick={() => window.print()} color="primary">
              {t('Save as PDF or Print')}
            </Button>

            <Button className="ml-auto" color="transparent" onClick={onClose}>
              <FaWindowClose />
            </Button>
          </Col>
        </Row>

        <Row className="page">
          <Col>
            <Row>
              <Col>
                <h1 className="heading-main text-center text-bold">{`COVID-19 Scenarios`}</h1>

                <p className="text-center text-bold mb-0">{`Printable report`}</p>
                <p className="text-center text-bold">
                  {`Generated from `}
                  <LinkExternal url="https://covid19-scenarios.org">{`covid19-scenarios.org`}</LinkExternal>
                  {` on `}
                  {dateTimeFormat(new Date())}
                </p>
              </Col>
            </Row>

            <Row>
              <Col>
                <h2 className="text-center text-bold">{`Important information`}</h2>

                <PrintIntroduction />

                <blockquote className="blockquote font-weight-bold">
                  <PrintDisclaimer />
                </blockquote>
              </Col>
            </Row>
          </Col>

          <Table className="w-75 center mx-auto table-layout-fixed">
            <tbody>
              <tr>
                <td className="w-100 text-center">
                  <LinkExternal url="https://neherlab.org/" alt="Link to website of NeherLab">
                    <img className="mx-auto" height={'50px'} alt="NeherLab logo" src={logoNeherlab} />
                  </LinkExternal>
                </td>

                <td className="w-100 text-center">
                  <LinkExternal url="https://www.biozentrum.unibas.ch/" alt="Link to website of Biozentrum Basel">
                    <img className="mx-auto" height={'50px'} alt="Logo of Biozentrum" src={logoBiozentrum} />
                  </LinkExternal>
                </td>

                <td className="w-100 text-center">
                  <LinkExternal url="https://www.unibas.ch/en.html" alt="Link to website of University of Basel">
                    <img className="mx-auto" height={'50px'} alt="Logo of University of Basel" src={logoUnibas} />
                  </LinkExternal>
                </td>
              </tr>
            </tbody>

            <tbody>
              <tr>
                <td className="w-100 text-center">
                  <LinkExternal url="https://neherlab.org/" alt="Link to website of NeherLab">
                    {`neherlab.org`}
                  </LinkExternal>
                </td>

                <td className="w-100 text-center">
                  <LinkExternal url="https://www.biozentrum.unibas.ch/" alt="Link to website of Biozentrum Basel">
                    {`biozentrum.unibas.ch`}
                  </LinkExternal>
                </td>

                <td className="w-100 text-center">
                  <LinkExternal url="https://www.unibas.ch/en.html" alt="Link to website of Biozentrum Basel">
                    {`unibas.ch`}
                  </LinkExternal>
                </td>
              </tr>
            </tbody>
          </Table>
        </Row>

        <Row className="page" style={{ breakBefore: 'always', pageBreakBefore: 'always' }}>
          <Col>
            <h2>{`Scenario: ${scenarioUsed}`}</h2>

            <h2>{`Parameters`}</h2>

            <h4 className="pt-3">{`Population`}</h4>

            <Table className="table-parameters">
              <thead>
                <tr>
                  <th>{`Parameter`}</th>
                  <th>{`Value`}</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(params.population).map(([key, val]) => (
                  <tr key={key}>
                    <td className="text-left pl-2 pr-4 py-0">{_.get(parameterExplanations, key) || key}</td>
                    <td className="text-right pl-4 pr-2 py-0">{val}</td>
                  </tr>
                ))}
              </tbody>

              <h4 className="pt-3">{`Epidemiology`}</h4>

              <thead>
                <tr>
                  <th>{`Parameter`}</th>
                  <th>{`Value`}</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(params.epidemiological).map(([key, val]) => {
                  // NOTE: val can be of different types here
                  let value = val
                  if (key === 'peakMonth') {
                    value = months[val]
                  }

                  if (key === 'r0') {
                    const [lower, upper] = val.map((x: number) => Math.round(10 * x) / 10)
                    value = `(${lower}, ${upper})`
                  }

                  return (
                    <tr key={key}>
                      <td className="text-left pl-2 pr-4 py-0">{_.get(parameterExplanations, key) || key}</td>
                      <td className="text-right pl-4 pr-2 py-0">{value}</td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>

            <h4 className="pt-3">{`Mitigation`}</h4>

            <Table className="table-parameters">
              <thead>
                <tr>
                  <th>{`Intervention name`}</th>
                  <th>{`From`}</th>
                  <th>{`To`}</th>
                  <th>
                    {`Reduction of`}
                    <br />
                    {`transmission`}
                  </th>
                </tr>
              </thead>

              <tbody>
                {params.containment.mitigationIntervals.map(({ id, name, timeRange, mitigationValue }) => {
                  return (
                    <tr key={id}>
                      <td className="text-left pl-2 pr-4 py-0">{name}</td>
                      <td className="text-right pl-4 pr-2 py-0">{dateFormat(timeRange.tMin)}</td>
                      <td className="text-right pl-4 pr-2 py-0">{dateFormat(timeRange.tMax)}</td>
                      <td className="text-right pl-2 pr-4 py-0">{`${mitigationValue}%`}</td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </Col>
        </Row>

        <Row className="page" style={{ breakBefore: 'always', pageBreakBefore: 'always' }}>
          <Col>
            <Row>
              <Col>
                <h2>{`Results`}</h2>
                <DeterministicLinePlot
                  data={result}
                  params={params}
                  mitigation={params.containment}
                  logScale
                  showHumanized
                  caseCounts={caseCounts}
                />
              </Col>
            </Row>

            <Row>
              <Col>
                <h2>{`Results summary`}</h2>
                <TableResult result={result} />
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="page" style={{ breakBefore: 'always', pageBreakBefore: 'always' }}>
          <Col>
            <Row>
              <Col>
                <AgeBarChart showHumanized data={result} rates={severity} printLabel />
              </Col>
            </Row>

            <Row>
              <Col>
                <OutcomeRatesTable showHumanized result={result} rates={severity} printable />
              </Col>
            </Row>
          </Col>
        </Row>

        <div className="fixed-bottom w-100 d-flex d-print-none">
          <Button className="btn-shadow mx-auto" onClick={() => window.print()} color="primary">
            {t('Save as PDF or Print')}
          </Button>
        </div>
      </Container>
    )
  }
  return null
}
