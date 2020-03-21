import React, { useState } from 'react'

import Papa from 'papaparse'
import { Button, Col, Row } from 'reactstrap'

import { readFile } from '../../../helpers/readFile'

import { exportResult } from '../../../algorithms/exportResult'
import { AlgorithmResult, UserResult } from '../../../algorithms/Result.types'
import processUserResult from '../../../algorithms/userResult'

import { EmpiricalData }from '../../../algorithms/Param.types'

import { CollapsibleCard } from '../../Form/CollapsibleCard'
import FormSwitch from '../../Form/FormSwitch'

import { SeverityTableRow } from '../Scenario/SeverityTable'

import { ComparisonModalWithButton } from '../Compare/ComparisonModalWithButton'
import { FileType } from '../Compare/FileUploadZone'

import { AgeBarChart } from './AgeBarChart'
import { DeterministicLinePlot } from './DeterministicLinePlot'
import { OutcomeRatesTable } from './OutcomeRatesTable'

import { useTranslation } from 'react-i18next'

export interface ResutsCardProps {
  canRun: boolean
  severity: SeverityTableRow[] // TODO: pass severity throughout the algorithm and as a part of `AlgorithmResult` instead?
  result?: AlgorithmResult
  caseCounts?: EmpiricalData
}

function ResultsCard({ canRun, severity, result, caseCounts }: ResutsCardProps) {
  const { t } = useTranslation()
  const [logScale, setLogScale] = useState<boolean>(true)

  // TODO: shis should probably go into the `Compare/`
  const [files, setFiles] = useState<Map<FileType, File>>(new Map())
  const [userResult, setUserResult] = useState<UserResult | undefined>()

  // TODO: shis should probably go into the `Compare/`
  async function handleFileSubmit(files: Map<FileType, File>) {
    
    setFiles(files)

    const csvFile: File | undefined = files.get(FileType.CSV)
    if (!csvFile) {
      throw new Error(`t('Error'): t('Csv-file-is-missing')`)
    }

    const csvString: string = await readFile(csvFile)
    const { data, errors, meta } = Papa.parse(csvString, { trimHeaders: false })
    if (meta.aborted || errors.length > 0) {
      // TODO: have to report this back to the user
      throw new Error(`t('Error'): t('Csv-file-could-not-be-parsed')`)
    }
    const newUserResult = processUserResult(data)
    setUserResult(newUserResult)
  }

  const hasResult = Boolean(result?.deterministicTrajectory)
  const canExport = Boolean(hasResult)
  return (
    <CollapsibleCard
      identifier="results-card"
      title={<h3 className="p-0 m-0 text-truncate">{t('Results')}</h3>}
      help={t('This-section-contains-simulation-results')}
      defaultCollapsed={false}
    >
      <Row noGutters>
        <Col>
          <p>
            {t('Results-disclaimer')}
          </p>
        </Col>
      </Row>
      <Row noGutters className="mb-4">
        <Col>
          <div>
            <span>
              <Button className="run-button" type="submit" color="primary" disabled={!canRun}>
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
                onClick={() => canExport && result && exportResult(result)}
              >
                {t('Export')}
              </Button>
            </span>
          </div>
        </Col>
      </Row>

      <Row noGutters hidden={!result}>
        <Col>
          <FormSwitch
            identifier="logScale"
            label={t('Log-scale')}
            help={t('Toggle-between-logarithmic-and-linear-scale-on-vertical-axis-of-the-plot')}
            checked={logScale}
            onValueChanged={setLogScale}
          />
        </Col>
      </Row>
      <Row noGutters>
        <Col>
          <DeterministicLinePlot data={result} userResult={userResult} logScale={logScale} caseCounts={caseCounts} />
        </Col>
      </Row>
      <Row>
        <Col>
          <AgeBarChart data={result} rates={severity} />
        </Col>
      </Row>
      <Row>
        <Col>
          <OutcomeRatesTable result={result} rates={severity} />
        </Col>
      </Row>
    </CollapsibleCard>
  )
}

export { ResultsCard }
