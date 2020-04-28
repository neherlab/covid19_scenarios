import React, { createRef, useEffect, useMemo, useState } from 'react'

import { Button, Col, CustomInput, FormGroup, Row } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import type { AlgorithmResult } from '../../../algorithms/types/Result.types'
import type { CaseCountsDatum, SeverityDistributionDatum } from '../../../algorithms/types/Param.types'

import LocalStorage, { LOCAL_STORAGE_KEYS } from '../../../helpers/localStorage'

import { stateToURL } from '../state/serialize'
import { State } from '../state/state'

import LinkButton from '../../Buttons/LinkButton'
import FormSwitch from '../../Form/FormSwitch'
import { CardWithControls } from '../../Form/CardWithControls'

import ExportSimulationDialog from './ExportSimulationDialog'
import { AgeBarChart } from './AgeBarChart'
import { DeterministicLinePlot } from './DeterministicLinePlot'
import { OutcomeRatesTable } from './OutcomeRatesTable'

import './ResultsCard.scss'

const LOG_SCALE_DEFAULT = true
const SHOW_HUMANIZED_DEFAULT = true

interface ResultsCardProps {
  autorunSimulation: boolean
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
  autorunSimulation,
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
  const [showExportModal, setShowExportModal] = useState<boolean>(false)

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

  const setPersistLogScale = (value: boolean) => {
    LocalStorage.set(LOCAL_STORAGE_KEYS.LOG_SCALE, value)
    setLogScale(value)
  }

  const setPersistShowHumanized = (value: boolean) => {
    LocalStorage.set(LOCAL_STORAGE_KEYS.SHOW_HUMANIZED_RESULTS, value)
    setShowHumanized(value)
  }

  const scrollTargetRef = createRef<HTMLSpanElement>()

  const toggleShowExportModal = () => setShowExportModal(!showExportModal)

  const scenarioUrl = useMemo(
    () =>
      stateToURL({
        scenario: scenarioState.data,
        scenarioName: scenarioState.current,
        ageDistribution: scenarioState.ageDistribution,
        ageDistributionName: scenarioState.data.population.ageDistributionName,
        severity,
        severityName,
      }),
    [scenarioState, severity, severityName],
  )

  return (
    <>
      <span ref={scrollTargetRef} />
      <CardWithControls
        identifier="results-card"
        className="card--main card--results"
        label={
          <h2 className="p-0 m-0 text-truncate d-flex align-items-center" data-testid="ResultsCardTitle">
            <Button onClick={toggleResultsMaximized} className="btn-dark mr-2">
              {areResultsMaximized ? <FiChevronRight /> : <FiChevronLeft />}
            </Button>
            <span>{t('Results')}</span>
          </h2>
        }
        help={t('This section contains simulation results')}
      >
        <Row className="mb-0">
          <Col xs={12} sm={6} md={4}>
            <div className="btn-container mb-3">
              <Button
                className="run-button"
                type="submit"
                color="primary"
                disabled={!canRun || isRunning}
                data-testid="RunResults"
                title={t(autorunSimulation ? 'Force a run of the simulation' : 'Run the simulation')}
              >
                {isRunning ? t('Running...') : t(autorunSimulation ? 'Refresh' : 'Run')}
              </Button>
              <LinkButton
                className="new-tab-button"
                color="secondary"
                disabled={!canRun}
                href={scenarioUrl}
                target="_blank"
                data-testid="RunResultsInNewTab"
              >
                {t('Run in new tab')}
              </LinkButton>

              <Button
                className="export-button"
                type="button"
                color="secondary"
                disabled={!canExport}
                onClick={(_) => setShowExportModal(true)}
              >
                {t('Export')}
              </Button>
            </div>
          </Col>
          <Col xs={12} sm={6} md={8}>
            <p className="m-0 caution-text">
              {t(
                'This output of any model depends on model assumptions and parameter choices. Please carefully consider the parameters you choose (R0 and the mitigation measures in particular) and interpret the output with caution.',
              )}
            </p>
            <FormGroup inline className="ml-auto">
              <label htmlFor="autorun-checkbox" className="d-flex">
                <CustomInput
                  id="autorun-checkbox"
                  type="checkbox"
                  onChange={toggleAutorun}
                  checked={autorunSimulation}
                  aria-checked={autorunSimulation}
                />
                {t(`Run automatically`)}
              </label>
            </FormGroup>
          </Col>
        </Row>
        <Row noGutters hidden={!result} className="mb-0">
          <div className="mr-4" data-testid="LogScaleSwitch">
            <FormSwitch
              identifier="logScale"
              label={t('Log scale')}
              help={t('Toggle between logarithmic and linear scale on vertical axis of the plot')}
              checked={logScale}
              onValueChanged={setPersistLogScale}
            />
          </div>
          <div data-testid="HumanizedValuesSwitch">
            <FormSwitch
              identifier="showHumanized"
              label={t('Format numbers')}
              help={t('Show numerical results in a human friendly format')}
              checked={showHumanized}
              onValueChanged={setPersistShowHumanized}
            />
          </div>
        </Row>
        <Row noGutters>
          <Col>
            <DeterministicLinePlot
              data={result}
              params={scenarioData}
              logScale={logScale}
              showHumanized={showHumanized}
              caseCounts={caseCounts}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <AgeBarChart
              showHumanized={showHumanized}
              data={result}
              rates={severity}
              ageDistribution={ageDistribution}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <OutcomeRatesTable showHumanized={showHumanized} result={result} rates={severity} />
          </Col>
        </Row>
      </CardWithControls>
      {result ? (
        <Button
          className="goToResultsBtn"
          color="primary"
          onClick={() =>
            scrollTargetRef.current &&
            scrollTargetRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest',
            })
          }
        >
          {t('Go to results')}
        </Button>
      ) : undefined}
      <ExportSimulationDialog
        showModal={showExportModal}
        openPrintPreview={openPrintPreview}
        toggleShowModal={toggleShowExportModal}
        canExport={canExport}
        scenarioUrl={scenarioUrl}
        result={result}
        params={scenarioData}
      />
    </>
  )
}

export const ResultsCard = React.memo(ResultsCardFunction)
