import Papa from 'papaparse'
import React, { createRef, useEffect, useState } from 'react'
import { Button, Col, Row } from 'reactstrap'
import { useTranslation } from 'react-i18next'

import ExportSimulationDialog from './ExportSimulationDialog'
import FormSwitch from '../../Form/FormSwitch'
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
  const [logScale, setLogScale] = useState(true)
  const [showHumanized, setShowHumanized] = useState(true)

  // TODO: shis should probably go into the `Compare/`
  const [files, setFiles] = useState<Map<FileType, File>>(new Map())
  const [userResult, setUserResult] = useState<UserResult | undefined>()

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
      <span ref={scrollTargetRef}/>
      <CollapsibleCard
        identifier="results-card"
        title={
          <h3 className="p-0 m-0 text-truncate" data-testid="ResultsCardTitle">
            {t('Results')}
          </h3>
        }
        help={t('This section contains simulation results')}
        defaultCollapsed={false}
      >
        <Row noGutters>
          <Col>
            <p>
              {t(
                'This output of a mathematical model depends on model assumptions and parameter choices. We have done our best (in limited time) to check the model implementation is correct. Please carefully consider the parameters you choose and interpret the output with caution',
              )}
            </p>
          </Col>
        </Row>
        <Row noGutters className="mb-4 pl-4">
          <label className="form-check-label">
            <input
              type="checkbox"
              className="form-check-input"
              onChange={toggleAutorun}
              checked={autorunSimulation}
              aria-checked={autorunSimulation}
            />
            Autorun Simulation on scenario parameter change
          </label>
        </Row>
        <Row noGutters className="mb-4">
          <Col>
            <div>
              <span>
                <Button
                  className="run-button"
                  type="submit"
                  color="primary"
                  disabled={!canRun || autorunSimulation}
                  data-testid="RunResults"
                >
                  {t('Run')}
                </Button>
              </span>
              <span>
                <ComparisonModalWithButton files={files} onFilesChange={handleFileSubmit} />
              </span>
              <span>
                <Button
                  className="export-button"
                  type="button"
                  color="secondary"
                  disabled={!canExport}
                  onClick={(_) => setShowExportModal(true)}
                >
                  {t('Export')}
                </Button>
              </span>
            </div>
          </Col>
        </Row>

        <Row noGutters hidden={!result}>
          <Col data-testid="LogScaleSwitch">
            <FormSwitch
              identifier="logScale"
              label={t('Log scale')}
              help={t('Toggle between logarithmic and linear scale on vertical axis of the plot')}
              checked={logScale}
              onValueChanged={setLogScale}
            />
          </Col>
          <Col data-testid="HumanizedValuesSwitch">
            <FormSwitch
              identifier="showHumanized"
              label={t('Show humanized results')}
              help={t('Show numerical results in a human friendly format')}
              checked={showHumanized}
              onValueChanged={setShowHumanized}
            />
          </Col>
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
