import React from 'react'

import { get } from 'lodash'

import moment from 'moment'
import { goBack } from 'connected-react-router'
import { connect } from 'react-redux'
import { Button, Col, Container, Row, Table } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { FaWindowClose } from 'react-icons/fa'

import i18n from '../../../i18n/i18n'

import type { AlgorithmResult } from '../../../algorithms/types/Result.types'
import type {
  ScenarioDatum,
  SeverityDistributionDatum,
  AgeDistributionDatum,
} from '../../../algorithms/types/Param.types'
import { selectHasResult, selectResult } from '../../../state/algorithm/algorithm.selectors'
import {
  selectAgeDistributionData,
  selectCurrentScenarioName,
  selectScenarioData,
  selectSeverityDistributionData,
} from '../../../state/scenario/scenario.selectors'

import { ResultsTrajectoriesPlot } from '../ResultsTrajectoriesPlot/ResultsTrajectoriesPlot'
import { OutcomeRatesTable } from '../Results/OutcomeRatesTable'
import { AgeBarChart } from '../Results/AgeBarChart'
import { OutcomesDetailsTable } from '../Results/OutcomesDetailsTable'
import { dateFormat, dateTimeFormat } from './dateFormat'

import type { State } from '../../../state/reducer'

import LinkExternal from '../../Router/LinkExternal'

import PrintIntroduction from './PrintIntroduction.mdx'
import PrintDisclaimer from './PrintDisclaimer.mdx'

import { ReactComponent as LogoNeherlab } from '../../../assets/img/neherlab.svg'
import { ReactComponent as LogoBiozentrum } from '../../../assets/img/biozentrum.svg'
import { ReactComponent as LogoUnibas } from '../../../assets/img/unibas.svg'

import './PrintPreview.scss'

const months = moment.months()

const parameterExplanations = {
  cases: i18n.t('Case counts for'),
  country: i18n.t('Age distribution for'),
  populationServed: i18n.t('Population size'),
  hospitalBeds: i18n.t('Number of hospital beds'),
  ICUBeds: i18n.t('Number of available ICU beds'),
  importsPerDay: i18n.t('Cases imported into community per day'),
  initialNumberOfCases: i18n.t('Number of cases at the start of the simulation'),
  infectiousPeriod: i18n.t('Infectious period [days]'),
  latencyTime: i18n.t('Latency [days]'),
  lengthHospitalStay: i18n.t('Average time in regular ward [days]'),
  lengthICUStay: i18n.t('Average time in ICU ward [days]'),
  overflowSeverity: i18n.t('Increase in death rate when ICUs are overcrowded'),
  r0: i18n.t('R0 at the beginning of the outbreak'),
  seasonalForcing: i18n.t('Seasonal variation in transmissibility'),
  peakMonth: i18n.t('Seasonal peak in transmissibility'),
}

const print = () => typeof window !== 'undefined' && window.print()

export interface PrintPreviewDisconnectedProps {
  scenarioData: ScenarioDatum
  scenarioName: string
  ageDistributionData: AgeDistributionDatum[]
  severityDistributionData: SeverityDistributionDatum[]
  hasResult: boolean
  result?: AlgorithmResult
  goBack(): void
}

const mapStateToProps = (state: State) => ({
  scenarioData: selectScenarioData(state),
  scenarioName: selectCurrentScenarioName(state),
  ageDistributionData: selectAgeDistributionData(state),
  severityDistributionData: selectSeverityDistributionData(state),
  hasResult: selectHasResult(state),
  result: selectResult(state),
})

const mapDispatchToProps = {
  goBack,
}

export const PrintPreview = connect(mapStateToProps, mapDispatchToProps)(PrintPreviewDisconnected)

export function PrintPreviewDisconnected({
  scenarioData,
  scenarioName,
  ageDistributionData,
  severityDistributionData,
  hasResult,
  result,
  goBack,
}: PrintPreviewDisconnectedProps) {
  const { t } = useTranslation()

  const linkComponent = <LinkExternal url="https://covid19-scenarios.org">{t('covid19-scenarios.org')}</LinkExternal>
  const formattedDate = dateTimeFormat(new Date())

  if (hasResult) {
    return (
      <Container className="container-print">
        <Row className="d-print-none">
          <Col className="w-100 d-flex">
            <Button className="mr-auto" onClick={print} color="primary">
              {t('Save as PDF or Print')}
            </Button>

            <Button className="ml-auto" color="transparent" onClick={goBack}>
              <FaWindowClose />
            </Button>
          </Col>
        </Row>

        <Row className="page">
          <Col>
            <Row>
              <Col>
                <h1 className="heading-main text-center text-bold">{t(`COVID-19 Scenarios`)}</h1>
                <p className="text-center text-bold mb-0">{t(`Printable report`)}</p>
                <p className="text-center text-bold">
                  {t(`Generated from {{appUrl}}`, { appUrl: '' })}${linkComponent}
                  {t(` on {{date}}`, { date: formattedDate })}
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

            <Row>
              <Col>
                <Table className="w-75 center mx-auto table-layout-fixed">
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
                  </tbody>

                  <tbody>
                    <tr>
                      <td className="w-100 text-center">
                        <LinkExternal url="https://neherlab.org/" alt="Link to website of NeherLab">
                          {t('neherlab.org')}
                        </LinkExternal>
                      </td>

                      <td className="w-100 text-center">
                        <LinkExternal url="https://www.biozentrum.unibas.ch/" alt="Link to website of Biozentrum Basel">
                          {t('biozentrum.unibas.ch')}
                        </LinkExternal>
                      </td>

                      <td className="w-100 text-center">
                        <LinkExternal url="https://www.unibas.ch/en.html" alt="Link to website of Biozentrum Basel">
                          {t('unibas.ch')}
                        </LinkExternal>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="page" style={{ breakBefore: 'always', pageBreakBefore: 'always' }}>
          <Col>
            <h2>{t(`Scenario: ${scenarioName}`)}</h2>

            <h2>{t('Parameters')}</h2>

            <h4 className="pt-3">{t('Population')}</h4>

            <Table className="table-parameters">
              <thead>
                <tr>
                  <th>{t('Parameter')}</th>
                  <th>{t('Value')}</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(scenarioData.population).map(([key, val]) => (
                  <tr key={key}>
                    <td className="text-left pl-2 pr-4 py-0">{get(parameterExplanations, key) || key}</td>
                    <td className="text-right pl-4 pr-2 py-0">{val}</td>
                  </tr>
                ))}
              </tbody>

              <h4 className="pt-3">{`Epidemiology`}</h4>

              <thead>
                <tr>
                  <th>{t('Parameter')}</th>
                  <th>{t('Value')}</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(scenarioData.epidemiological).map(([key, val]) => {
                  // NOTE: val can be of different types here
                  // FIXME: This is a hole in type system, because the type of `val` is not checked (any)
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  let value = val
                  if (key === 'peakMonth') {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    value = months[val]
                  }

                  if (key === 'r0') {
                    const [begin, end] = Object.values(val).map((x) => Math.round(10 * (x as number)) / 10)
                    value = `${begin} - ${end}`
                  }

                  return (
                    <tr key={key}>
                      <td className="text-left pl-2 pr-4 py-0">{get(parameterExplanations, key) || key}</td>
                      <td className="text-right pl-4 pr-2 py-0">{value}</td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>

            <h4 className="pt-3">{t(`Mitigation`)}</h4>

            <Table className="table-parameters">
              <thead>
                <tr>
                  <th>{t('Intervention name')}</th>
                  <th>{t('From')}</th>
                  <th>{t('To')}</th>
                  <th>{t('Reduction of transmission')}</th>
                </tr>
              </thead>

              <tbody>
                {scenarioData.mitigation.mitigationIntervals.map(({ id, name, timeRange, transmissionReduction }) => {
                  const { begin: trMin, end: trMax } = transmissionReduction
                  const tr = `${trMin}% - ${trMax}%`

                  return (
                    <tr key={id}>
                      <td className="text-left pl-2 pr-4 py-0">{name}</td>
                      <td className="text-right pl-4 pr-2 py-0">{dateFormat(timeRange.begin)}</td>
                      <td className="text-right pl-4 pr-2 py-0">{dateFormat(timeRange.end)}</td>
                      <td className="text-right pl-2 pr-4 py-0">{tr}</td>
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
                <h2>{t('Results')}</h2>
                <ResultsTrajectoriesPlot />
              </Col>
            </Row>

            <Row>
              <Col>
                <h2>{t('Results summary')}</h2>
                <OutcomesDetailsTable forPrint />
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="page" style={{ breakBefore: 'always', pageBreakBefore: 'always' }}>
          <Col>
            <Row>
              <Col>
                <AgeBarChart />
              </Col>
            </Row>

            <Row>
              <Col>
                <OutcomeRatesTable forPrint />
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
