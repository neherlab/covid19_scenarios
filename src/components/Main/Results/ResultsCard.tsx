import Papa from 'papaparse'
import React, { createRef, useEffect, useState } from 'react'
import { Button, Col, Row } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import ExportSimulationDialog from './ExportSimulationDialog'
import FormSwitch from '../../Form/FormSwitch'
import LocalStorage, { LOCAL_STORAGE_KEYS } from '../../../helpers/localStorage'
import processUserResult from '../../../algorithms/utils/userResult'
import { AgeBarChart } from './AgeBarChart'
import { AlgorithmResult, UserResult } from '../../../algorithms/types/Result.types'
import { CollapsibleCard } from '../../Form/CollapsibleCard'
import { ComparisonModalWithButton } from '../Compare/ComparisonModalWithButton'
import { DeterministicLinePlot } from './DeterministicLinePlot'
import { EmpiricalData } from '../../../algorithms/types/Param.types'
import { FileType } from '../Compare/FileUploadZone'
import { OutcomeRatesTable } from './OutcomeRatesTable'
import { readFile } from '../../../helpers/readFile'
import { SeverityTableRow } from '../Scenario/SeverityTable'

import './ResultsCard.scss'

const LOG_SCALE_DEFAULT = true
const SHOW_HUMANIZED_DEFAULT = true

interface ResultsCardProps {
  autorunSimulation: boolean
  toggleAutorun: () => void
  canRun: boolean
  severity: SeverityTableRow[] // TODO: pass severity throughout the algorithm and as a part of `AlgorithmResult` instead?
  result?: AlgorithmResult
  caseCounts?: EmpiricalData
}

function ResultsCardFunction({
  canRun,
  autorunSimulation,
  toggleAutorun,
  severity,
  result,
  caseCounts,
}: ResultsCardProps) {
  const { t } = useTranslation()
  const [logScale, setLogScale] = useState(LOG_SCALE_DEFAULT)
  const [showHumanized, setShowHumanized] = useState(SHOW_HUMANIZED_DEFAULT)

  // TODO: shis should probably go into the `Compare/`
  const [files, setFiles] = useState<Map<FileType, File>>(new Map())
  const [userResult, setUserResult] = useState<UserResult | undefined>()

  useEffect(() => {
    const persistedLogScale = LocalStorage.get<boolean>(LOCAL_STORAGE_KEYS.LOG_SCALE)
    setLogScale(persistedLogScale ?? LOG_SCALE_DEFAULT)

    const persistedShowHumanized = LocalStorage.get<boolean>(LOCAL_STORAGE_KEYS.SHOW_HUMANIZED_RESULTS)
    setShowHumanized(persistedShowHumanized ?? SHOW_HUMANIZED_DEFAULT)
  }, [])

  const setPersistLogScale = (value: boolean) => {
    LocalStorage.set(LOCAL_STORAGE_KEYS.LOG_SCALE, value)
    setLogScale(value)
  }

  const setPersistShowHumanized = (value: boolean) => {
    LocalStorage.set(LOCAL_STORAGE_KEYS.SHOW_HUMANIZED_RESULTS, value)
    setShowHumanized(value)
  }

  // TODO: shis should probably go into the `Compare/`
  async function handleFileSubmit(files: Map<FileType, File>) {
    setFiles(files)

    const csvFile: File | undefined = files.get(FileType.CSV)
    if (!csvFile) {
      throw new Error(`t('Error'): t('CSV file is missing')`)
    }

    const csvString: string = await readFile(csvFile)
    const { data, errors, meta } = Papa.parse(csvString, { trimHeaders: false })
    if (meta.aborted || errors.length > 0) {
      // TODO: have to report this back to the user
      throw new Error(`t('Error'): t('CSV file could not be parsed')`)
    }
    const newUserResult = processUserResult(data)
    setUserResult(newUserResult)
  }

  const [canExport, setCanExport] = useState<boolean>(false)
  const [showExportModal, setShowExportModal] = useState<boolean>(false)

  const scrollTargetRef = createRef<HTMLSpanElement>()

  const toggleShowExportModal = () => setShowExportModal(!showExportModal)

  useEffect(() => {
    setCanExport((result && !!result.deterministic) || false)
  }, [result])

  return (
    <>
      <span ref={scrollTargetRef} />
      <CollapsibleCard
        identifier="results-card"
        className="card--main card--results"
        title={
          <h2 className="p-0 m-0 text-truncate" data-testid="ResultsCardTitle">
            {t('Results')}
          </h2>
        }
        help={t('This section contains simulation results')}
        defaultCollapsed={false}
      >
        <Row className="mb-4">
          <Col xs={12} sm={6} md={4}>
            <div className="btn-container mb-3">
              <Button
                className="run-button"
                type="submit"
                color="primary"
                disabled={!canRun || autorunSimulation}
                data-testid="RunResults"
              >
                {t('Run')}
              </Button>
              <ComparisonModalWithButton files={files} onFilesChange={handleFileSubmit} />
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
            <div className="pl-4">
              <label className="form-check-label">
                <input
                  type="checkbox"
                  className="form-check-input"
                  onChange={toggleAutorun}
                  checked={autorunSimulation}
                  aria-checked={autorunSimulation}
                />
                {t('Autorun Simulation on scenario parameter change')}
              </label>
            </div>
          </Col>
          <Col xs={12} sm={6} md={8}>
            <p className="m-0 caution-text">
              {t(
                'This output of a mathematical model depends on model assumptions and parameter choices. We have done our best (in limited time) to check the model implementation is correct. Please carefully consider the parameters you choose and interpret the output with caution',
              )}
            </p>
          </Col>
        </Row>
        <Row noGutters hidden={!result} className="mb-4">
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
              label={t('Show humanized results')}
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
              userResult={userResult}
              logScale={logScale}
              showHumanized={showHumanized}
              caseCounts={caseCounts}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <AgeBarChart showHumanized={showHumanized} data={result} rates={severity} />
          </Col>
        </Row>
        <Row>
          <Col>
            <OutcomeRatesTable showHumanized={showHumanized} result={result} rates={severity} />
          </Col>
        </Row>
      </CollapsibleCard>
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
        toggleShowModal={toggleShowExportModal}
        canExport={canExport}
        result={result}
      />
    </>
  )
}

export const ResultsCard = React.memo(ResultsCardFunction)
