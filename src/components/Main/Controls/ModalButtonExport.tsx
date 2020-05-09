import React, { useState } from 'react'

import { isEmpty } from 'lodash'

import { useTranslation } from 'react-i18next'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from 'reactstrap'
import { MdFileDownload } from 'react-icons/md'

import type { SeverityDistributionDatum } from '../../../algorithms/types/Param.types'
import type { AlgorithmResult } from '../../../algorithms/types/Result.types'
import type { State } from '../state/state'

import { exportResult, exportScenario } from '../../../algorithms/utils/exportResult'

import { FILENAME_PARAMS, FILENAME_RESULTS_DETAILED, FILENAME_RESULTS_SUMMARY } from './filenames'

export interface ModalButtonExportProps {
  scenarioState: State
  severity: SeverityDistributionDatum[]
  severityName: string
  result?: AlgorithmResult
}

function ModalButtonExport({ scenarioState, severity, severityName, result }: ModalButtonExportProps) {
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
    if (!canExportResult) {
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
    if (!result?.trajectory.middle) {
      return
    }

    exportResult({
      scenarioState,
      result,
      filename: FILENAME_RESULTS_DETAILED,
      detailed: true,
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
        <MdFileDownload size={35} />
        <div>{t(`Export`)}</div>
      </Button>
      <Modal className="export-modal" centered isOpen={isOpen} toggle={toggleOpen} fade={false}>
        <ModalHeader toggle={close}>{t(`Share`)}</ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <Card>
                <CardHeader>{t(`File Export`)}</CardHeader>
                <CardBody>
                  <Table>
                    <thead>
                      <tr>
                        <th>{t('Filename')}</th>
                        <th>{t('Description')}</th>
                        <th>{t('Format')}</th>
                        <th>{t('Action')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{FILENAME_PARAMS}</td>
                        <td>{t('Scenario parameters')}</td>
                        <td>JSON</td>
                        <td>
                          <Button title={t(`Download scenario parameters`)}>
                            onClick={exportScenarioParameters}
                            <MdFileDownload />
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td>{FILENAME_RESULTS_SUMMARY}</td>
                        <td>{t('Resuls (summarized)')}</td>
                        <td>TSV</td>
                        <td>
                          <Button
                            title={t(`Download summarized results`)}
                            disabled={canExportResult}
                            onClick={maybeExportResultSummary}
                          >
                            <MdFileDownload />
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td>{FILENAME_RESULTS_DETAILED}</td>
                        <td>{t('Results (detailed)')}</td>
                        <td>TSV</td>
                        <td>
                          <Button
                            title={t(`Download dtailed results`)}
                            disabled={canExportResult}
                            onClick={maybeExportResultDetailed}
                          >
                            <MdFileDownload />
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </CardBody>
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
