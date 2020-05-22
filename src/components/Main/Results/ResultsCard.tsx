import React, { useEffect, useMemo, useState, useRef } from 'react'

import classNames from 'classnames'
import { connect } from 'react-redux'
import { Button, Col, Row } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { FiChevronLeft } from 'react-icons/fi'
import urlJoin from 'proper-url-join'
import { toUrl } from '../../../io/serialization/toUrl'
import { selectIsRunning } from '../../../state/algorithm/algorithm.selectors'
import { State } from '../../../state/reducer'
import {
  selectAgeDistributionData,
  selectScenarioData,
  selectSeverityDistributionData,
} from '../../../state/scenario/scenario.selectors'
import {
  selectAreResultsMaximized,
  selectIsAutorunEnabled,
  selectIsLogScale,
  selectShouldFormatNumbers,
} from '../../../state/settings/settings.selectors'

import { CollapsibleCard } from '../../Form/CollapsibleCard'

import { CardWithControls } from '../../Form/CardWithControls'
import { Main } from '../Main'

import TableResult from '../PrintPage/TableResult'

import { AgeBarChart } from './AgeBarChart'
import { DeterministicLinePlot } from './DeterministicLinePlot'
import { OutcomeRatesTable } from './OutcomeRatesTable'
import { SimulationControls } from '../Controls/SimulationControls'

import './ResultsCard.scss'

interface ResultsCardProps {
  canRun: boolean

  isAutorunEnabled: boolean
  toggleAutorun: () => void
  isRunning: boolean

  openPrintPreview: () => void
  areResultsMaximized: boolean
  toggleResultsMaximized: () => void
}

const mapStateToProps = (state: State) => ({
  scenarioData: selectScenarioData(state),
  ageDistributionData: selectAgeDistributionData(state),
  severityDistributionData: selectSeverityDistributionData(state),

  isRunning: selectIsRunning(state),
  isAutorunEnabled: selectIsAutorunEnabled(state),
  isLogScale: selectIsLogScale(state),
  shouldFormatNumbers: selectShouldFormatNumbers(state),
  areResultsMaximized: selectAreResultsMaximized(state),
})

const mapDispatchToProps = {}

function ResultsCardFunction({
  canRun,
  isRunning,
  isAutorunEnabled,
  toggleAutorun,
  scenarioState,
  severity,
  severityName,
  result,
  caseCounts,
  openPrintPreview,
  areResultsMaximized,
  toggleResultsMaximized,
}: ResultsCardProps) {
  const { t } = useTranslation()
  const scrollTargetRef = useRef<HTMLDivElement | null>(null)

  const canExport = result && !!result.trajectory

  const scenarioUrl = decodeURI(urlJoin(window.location.href, toUrl()))

  function scrollToResults() {
    scrollTargetRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
  }

  return (
    <>
      <CardWithControls
        identifier="results-card"
        className="card-results"
        labelComponent={
          <h2 className="p-0 m-0 text-truncate d-flex align-items-center" data-testid="ResultsCardTitle">
            <Button
              onClick={toggleResultsMaximized}
              className="btn-dark btn-results-expand mr-2 pt-1 pb-2 d-none d-xl-block"
            >
              <FiChevronLeft className={classNames(areResultsMaximized ? 'icon-rotate-180' : 'icon-rotate-0')} />
            </Button>
            <span>{t('Results')}</span>
          </h2>
        }
        help={t('This section contains simulation results')}
      >
        <Row noGutters className="row-results-simulation-controls">
          <Col>
            <SimulationControls
              isRunning={isRunning}
              canRun={canRun}
              canExport={canExport}
              scenarioUrl={scenarioUrl}
              openPrintPreview={openPrintPreview}
              scenarioState={scenarioState}
              severityName={severityName}
              severity={severity}
              result={result}
              isLogScale={logScale}
              toggleLogScale={toggleLogScale}
              shouldFormatNumbers={showHumanized}
              toggleFormatNumbers={toggleFormatNumbers}
              isAutorunEnabled={isAutorunEnabled}
              toggleAutorun={toggleAutorun}
            />
          </Col>
        </Row>

        <Row noGutters className="row-results-trajectories">
          <Col>
            <div ref={scrollTargetRef} />
            <CardWithControls
              className="card-trajectories"
              identifier="trajectories"
              labelComponent={<h3 className="d-inline text-truncate">{t('Outbreak trajectories')}</h3>}
              help={t(`Simulation results over time`)}
            >
              <Row noGutters>
                <Col>
                  <DeterministicLinePlot />
                </Col>
              </Row>
            </CardWithControls>
          </Col>
        </Row>

        <Row noGutters className="row-results-age-distribution">
          <Col>
            <CardWithControls
              className="card-age-distribution"
              identifier="age-distribution"
              labelComponent={<h3 className="d-inline text-truncate">{t('Distribution across age groups')}</h3>}
              help={t('Summary of outcomes per age group')}
            >
              <AgeBarChart
                showHumanized={showHumanized}
                data={result}
                rates={severity}
                ageDistribution={ageDistribution}
              />
            </CardWithControls>
          </Col>
        </Row>

        <Row noGutters className="row-results-outcomes">
          <Col>
            <CollapsibleCard
              className="card-outcomes-table"
              identifier="outcomes-table"
              title={<h3 className="d-inline text-truncate">{t('Outcomes summary table')}</h3>}
              help={t('Summary table of outcomes for the entire population')}
              defaultCollapsed
            >
              <TableResult result={result} />
            </CollapsibleCard>
          </Col>
        </Row>

        <Row noGutters className="row-results-outcomes-table">
          <Col>
            <CardWithControls
              className="card-outcomes"
              identifier="outcomes"
              labelComponent={<h3 className="d-inline text-truncate">{t('Outcomes')}</h3>}
              help={t('Summary of outcomes for the entire population')}
            >
              <OutcomeRatesTable showHumanized={showHumanized} result={result} rates={severity} />
            </CardWithControls>
          </Col>
        </Row>
      </CardWithControls>

      {result && (
        <div className="container-goto-results d-flex d-md-none w-100">
          <Button className="btn-goto-results mx-auto" color="primary" onClick={scrollToResults}>
            {t('Go to results')}
          </Button>
        </div>
      )}
    </>
  )
}

export const ResultsCard = React.memo(ResultsCardFunction)

export default connect(mapStateToProps, mapDispatchToProps)(ResultsCard)
