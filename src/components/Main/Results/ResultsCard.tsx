import React, { useEffect, useMemo, useState, useRef } from 'react'

import classNames from 'classnames'
import { Button, Col, Row } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { FiChevronLeft } from 'react-icons/fi'
import urlJoin from 'proper-url-join'

import type { AlgorithmResult } from '../../../algorithms/types/Result.types'
import type { CaseCountsDatum, SeverityDistributionDatum } from '../../../algorithms/types/Param.types'

import LocalStorage, { LOCAL_STORAGE_KEYS } from '../../../helpers/localStorage'
import { CollapsibleCard } from '../../Form/CollapsibleCard'

import { dataToURL } from '../state/serialization/serialize'
import { State } from '../state/state'

import { CardWithControls } from '../../Form/CardWithControls'

import TableResult from '../PrintPage/TableResult'

import { AgeBarChart } from './AgeBarChart'
import { DeterministicLinePlot } from './DeterministicLinePlot'
import { OutcomeRatesTable } from './OutcomeRatesTable'
import { SimulationControls } from '../Controls/SimulationControls'
import { PlotSpinner } from './PlotSpinner'

import './ResultsCard.scss'

const LOG_SCALE_DEFAULT = true
const SHOW_HUMANIZED_DEFAULT = true
const ICON_SIZE = 50

interface ResultsCardProps {
  isAutorunEnabled: boolean
  toggleAutorun: () => void
  canRun: boolean
  isRunning: boolean
  scenarioState: State
  severity: SeverityDistributionDatum[]
  severityName: string
  caseCounts?: CaseCountsDatum[]
  result?: AlgorithmResult
  openPrintPreview: () => void
  areResultsMaximized: boolean
  toggleResultsMaximized: () => void
}

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
  const [logScale, setLogScale] = useState(LOG_SCALE_DEFAULT)
  const [showHumanized, setShowHumanized] = useState(SHOW_HUMANIZED_DEFAULT)
  const [canExport, setCanExport] = useState<boolean>(false)

  const scrollTargetRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const persistedLogScale = LocalStorage.get<boolean>(LOCAL_STORAGE_KEYS.LOG_SCALE)
    setLogScale(persistedLogScale ?? LOG_SCALE_DEFAULT)

    const persistedShowHumanized = LocalStorage.get<boolean>(LOCAL_STORAGE_KEYS.SHOW_HUMANIZED_RESULTS)
    setShowHumanized(persistedShowHumanized ?? SHOW_HUMANIZED_DEFAULT)
  }, [])

  useEffect(() => {
    setCanExport((result && !!result.trajectory) || false)
  }, [result])

  // RULE OF HOOKS #1: hooks go before anything else. Hooks ^, ahything else v.
  // href: https://reactjs.org/docs/hooks-rules.html

  const { data: scenarioData, ageDistribution } = scenarioState

  const toggleLogScale = () => {
    const value = !logScale
    LocalStorage.set(LOCAL_STORAGE_KEYS.LOG_SCALE, value)
    setLogScale(value)
  }

  const toggleFormatNumbers = () => {
    const value = !showHumanized
    LocalStorage.set(LOCAL_STORAGE_KEYS.SHOW_HUMANIZED_RESULTS, value)
    setShowHumanized(value)
  }

  function scrollToResults() {
    scrollTargetRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
  }

  const scenarioUrl = useMemo(() => {
    const url = dataToURL({
      scenario: scenarioState.data,
      scenarioName: scenarioState.current,
      ageDistribution: scenarioState.ageDistribution,
      ageDistributionName: scenarioState.data.population.ageDistributionName,
      severity,
      severityName,
    })

    return decodeURI(urlJoin(window.location.href, url))
  }, [scenarioState, severity, severityName])

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
                  <DeterministicLinePlot
                    data={result}
                    params={scenarioData}
                    logScale={logScale}
                    showHumanized={showHumanized}
                    caseCounts={caseCounts}
                  />
                  <PlotSpinner isRunning={isRunning} isAutorunEnabled={isAutorunEnabled} size={ICON_SIZE} />
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
              <Row>
                <Col>
                  <AgeBarChart
                    showHumanized={showHumanized}
                    data={result}
                    rates={severity}
                    ageDistribution={ageDistribution}
                    />
                  <PlotSpinner isRunning={isRunning} isAutorunEnabled={isAutorunEnabled} size={ICON_SIZE} />
                </Col>
              </Row>
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
              <Row>
                <Col>
                  <TableResult result={result} />
                  <PlotSpinner isRunning={isRunning} isAutorunEnabled={isAutorunEnabled} size={ICON_SIZE} />
                </Col>
              </Row>
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
              <Row>
                <Col>
                  <OutcomeRatesTable showHumanized={showHumanized} result={result} rates={severity} />
                  <PlotSpinner isRunning={isRunning} isAutorunEnabled={isAutorunEnabled} size={ICON_SIZE} />
                </Col>
              </Row>
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
