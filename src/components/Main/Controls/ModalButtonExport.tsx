import React, { useState } from 'react'

import { isEmpty } from 'lodash'

import { useTranslation } from 'react-i18next'
import {
  Button,
  Card,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  ListGroup,
  ListGroupItem,
} from 'reactstrap'
import { MdFileDownload } from 'react-icons/md'
import FileIcon, { defaultStyles } from 'react-file-icon'

import type { SeverityDistributionDatum } from '../../../algorithms/types/Param.types'
import type { AlgorithmResult } from '../../../algorithms/types/Result.types'
import type { State } from '../state/state'

import { exportAll, exportResult, exportScenario } from '../../../algorithms/utils/exportResult'

import { FILENAME_PARAMS, FILENAME_RESULTS_DETAILED, FILENAME_RESULTS_SUMMARY, FILENAME_ZIP } from './filenames'

import './ModalButtonExport.scss'

export interface ModalButtonExportProps {
  buttonSize: number
  scenarioState: State
  severity: SeverityDistributionDatum[]
  severityName: string
  result?: AlgorithmResult
}

export const FileIconJson = () => (
  <FileIcon
    {...defaultStyles.json}
    classname="mr-2 export-file-icon"
    size={45}
    extension="json"
    type="code"
    labelColor={'#66b51d'}
    glyphColor={'#66b51d'}
    labelUppercase
  />
)

export const FileIconTsv = ({ color = '#2e7ec9' }: { color: string }) => (
  <FileIcon
    {...defaultStyles.csv}
    classname="mr-2 export-file-icon"
    size={45}
    extension="tsv"
    type="spreadsheet"
    labelColor={color}
    glyphColor={color}
    labelUppercase
  />
)

export const FileIconTsvDetailed = () => <FileIconTsv color="#801f1d" />

export const FileIconZip = () => (
  <FileIcon
    {...defaultStyles.zip}
    classname="mr-2 export-file-icon"
    size={45}
    extension="zip"
    labelColor="#91640f"
    glyphColor="#91640f"
    labelUppercase
  />
)

export interface ExportElementProps {
  Icon: React.ElementType
  filename: string
  HelpMain: React.ElementType
  HelpDetails: React.ElementType
  HelpDownload: string
  onDownload(): void
}

export function ExportFileElement({
  Icon,
  filename,
  HelpMain,
  HelpDetails,
  HelpDownload,
  onDownload,
}: ExportElementProps) {
  return (
    <ListGroupItem className="d-flex">
      <span className="export-file-icon-container">
        <Icon />
      </span>
      <div className="mx-3 d-inline-block">
        <pre className="mb-0 export-file-filename">{filename}</pre>
        <p className="my-0 small">{HelpMain}</p>
        <p className="my-0 small">{HelpDetails}</p>
      </div>

      <div className="d-inline-block ml-auto">
        <Button color="transparent" className="btn-download" title={HelpDownload} onClick={onDownload}>
          <MdFileDownload size={30} />
        </Button>
      </div>
    </ListGroupItem>
  )
}

function ModalButtonExport({ buttonSize, scenarioState, severity, severityName, result }: ModalButtonExportProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  function toggleOpen() {
    setIsOpen(!isOpen)
  }

  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  const canExportResult = isEmpty(result)

  function exportScenarioParameters() {
    exportScenario({ scenarioState, severity, severityName, filename: FILENAME_PARAMS })
  }

  function maybeExportResultSummary() {
    if (canExportResult) {
      return
    }
    exportResult({
      scenarioState,
      result,
      filename: FILENAME_RESULTS_SUMMARY,
      detailed: false,
    })
  }

  function maybeExportResultDetailed() {
    if (canExportResult) {
      return
    }

    exportResult({
      scenarioState,
      result,
      filename: FILENAME_RESULTS_DETAILED,
      detailed: true,
    })
  }

  function maybeExportAll() {
    if (canExportResult) {
      return
    }

    exportAll({
      scenarioState,
      severity,
      severityName,
      result,
      filenameParams: FILENAME_PARAMS,
      filenameResultsDetailed: FILENAME_RESULTS_DETAILED,
      filenameResultsSummary: FILENAME_RESULTS_SUMMARY,
      filenameZip: FILENAME_ZIP,
    })
  }

  return (
    <>
      <Button
        className="btn-simulation-controls"
        type="button"
        color="secondary"
        onClick={open}
        title={t(`Download parameters and results`)}
      >
        <MdFileDownload size={buttonSize} />
      </Button>
      <Modal className="export-modal" centered isOpen={isOpen} toggle={toggleOpen} fade={false} size="lg">
        <ModalHeader toggle={close}>
          <MdFileDownload size={30} />
          <h3 className="ml-2 d-inline align-middle">{t(`Export`)}</h3>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <Card>
                <ListGroup flush>
                  <ExportFileElement
                    Icon={FileIconJson}
                    filename={FILENAME_PARAMS}
                    HelpMain={t('Parameters of the current scenario in JSON format.')}
                    HelpDetails={t(
                      'Can be loaded later into the simulator using "Load" button. A good starting point for creating custom scenarios.',
                    )}
                    HelpDownload={t('Download scenario parameters')}
                    onDownload={exportScenarioParameters}
                  />

                  <ExportFileElement
                    Icon={FileIconTsv}
                    filename={FILENAME_RESULTS_SUMMARY}
                    HelpMain={t('Results (summarized) as tab-separated values.')}
                    HelpDetails={t(
                      'Short version of results for further analysis, for example with spreadsheets or data-science tools.',
                    )}
                    HelpDownload={t('Download summarized results')}
                    onDownload={maybeExportResultSummary}
                  />

                  <ExportFileElement
                    Icon={FileIconTsvDetailed}
                    filename={FILENAME_RESULTS_DETAILED}
                    HelpMain={t('Results (detailed) as tab-separated values.')}
                    HelpDetails={t(
                      'Detailed version of results for further analysis. Same as above, but includes additional columns with results for age strata.',
                    )}
                    HelpDownload={t('Download detailed results')}
                    onDownload={maybeExportResultDetailed}
                  />

                  <ExportFileElement
                    Icon={FileIconZip}
                    filename={FILENAME_ZIP}
                    HelpMain={t('Results and parameters in a zip archive.')}
                    HelpDetails={t('Contains all of the above files in a single zip file.')}
                    HelpDownload={t('Download all in zip archive')}
                    onDownload={maybeExportAll}
                  />
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button className="close-button" type="button" onClick={close} title={t(`Close`)}>
            <div>{t(`Close`)}</div>
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export { ModalButtonExport }
