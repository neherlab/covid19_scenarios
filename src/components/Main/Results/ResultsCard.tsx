import Papa from 'papaparse'
import React, { createRef, useEffect, useState } from 'react'
import { Button, Col, CustomInput, FormGroup, Row } from 'reactstrap'
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
import { AllParams, ContainmentData, EmpiricalData } from '../../../algorithms/types/Param.types'
import { FileType } from '../Compare/FileUploadZone'
import { OutcomeRatesTable } from './OutcomeRatesTable'
import { readFile } from '../../../helpers/readFile'
import { SeverityTableRow } from '../Scenario/ScenarioTypes'
import LinkButton from '../../Buttons/LinkButton'
import './ResultsCard.scss'

const LOG_SCALE_DEFAULT = true
const SHOW_HUMANIZED_DEFAULT = true

interface ResultsCardProps {
  autorunSimulation: boolean
  toggleAutorun: () => void
  canRun: boolean
  params: AllParams
  mitigation: ContainmentData
  severity: SeverityTableRow[] // TODO: pass severity throughout the algorithm and as a part of `AlgorithmResult` instead?
  result?: AlgorithmResult
  caseCounts?: EmpiricalData
  scenarioUrl: string
  openPrintPreview: () => void
}

function ResultsCardFunction({
  canRun,
  autorunSimulation,
  toggleAutorun,
  params,
  mitigation,
  severity,
  result,
  caseCounts,
  scenarioUrl,
  openPrintPreview,
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
        <Row className="mb-0">
          <Col xs={12} sm={6} md={4}>
            <div className="btn-container mb-3">
              <Button
                className="run-button"
                type="submit"
                color="primary"
                disabled={!canRun}
                data-testid="RunResults"
                title={t(autorunSimulation ? 'Force a run of the simulation' : 'Run the simulation')}
              >
                {t(autorunSimulation ? 'Refresh' : 'Run')}
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
              userResult={userResult}
              params={params}
              mitigation={mitigation}
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
        openPrintPreview={openPrintPreview}
        toggleShowModal={toggleShowExportModal}
        canExport={canExport}
        result={result}
        scenarioUrl={scenarioUrl}
      />
    </>
  )
}

export const ResultsCard = React.memo(ResultsCardFunction)
