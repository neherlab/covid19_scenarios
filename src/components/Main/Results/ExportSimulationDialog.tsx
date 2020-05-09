import React from 'react'

import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import {
  TwitterShareButton,
  TwitterIcon,
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
} from 'react-share'

import urlJoin from 'proper-url-join'

import type { SeverityDistributionDatum } from '../../../algorithms/types/Param.types'
import type { AlgorithmResult } from '../../../algorithms/types/Result.types'
import { exportAll, exportScenario, exportResult } from '../../../algorithms/utils/exportResult'

import ClipboardButton from '../../Buttons/ClipboardButton'

import { State } from '../state/state'

export const FILENAME_PARAMS = 'c19s.params.json'
export const FILENAME_RESULTS_SUMMARY = 'c19s.results.summary.tsv'
export const FILENAME_RESULTS_DETAILED = 'c19s.results.detailed.tsv'
export const FILENAME_ZIP = 'c19s.zip'

export interface ExportSimulationDialogProps {
  canExport: boolean
  showModal: boolean
  toggleShowModal: () => void
  openPrintPreview: () => void
  scenarioState: State
  severity: SeverityDistributionDatum[]
  severityName: string
  result?: AlgorithmResult
  scenarioUrl: string
}

export default function ExportSimulationDialog({
  showModal,
  toggleShowModal,
  openPrintPreview,
  scenarioState,
  severity,
  severityName,
  result,
  scenarioUrl,
}: ExportSimulationDialogProps) {
  const { t } = useTranslation()

  const startPrinting = () => {
    toggleShowModal()
    openPrintPreview()
  }

  const shareableLink = urlJoin(window.location.href, scenarioUrl)

  // Size in pixels for the external icons like facebook, email
  const externalIconSize = 25

  // Boolean to control the shape of the external icons
  const isRoundIcon = true

  return (
    <Modal className="height-fit" centered size="lg" isOpen={showModal} toggle={toggleShowModal}>
      <ModalHeader toggle={toggleShowModal}>{t('Export simulation')}</ModalHeader>
      <ModalBody>
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
              <td>{t('The simulation parameters')}</td>
              <td>JSON</td>
              <td>
                <Button
                  onClick={() => exportScenario({ scenarioState, severity, severityName, filename: FILENAME_PARAMS })}
                  color="primary"
                  size="sm"
                >
                  {t('Download')}
                </Button>
              </td>
            </tr>
            <tr>
              <td>{FILENAME_RESULTS_SUMMARY}</td>
              <td>{t('The summarized results of the simulation')}</td>
              <td>TSV</td>
              <td>
                <Button
                  disabled={!(result?.trajectory.middle ?? null)}
                  onClick={() =>
                    result &&
                    exportResult({ scenarioState, result, filename: FILENAME_RESULTS_SUMMARY, detailed: false })
                  }
                  color="primary"
                  size="sm"
                >
                  {t('Download')}
                </Button>
              </td>
            </tr>
            <tr>
              <td>{FILENAME_RESULTS_DETAILED}</td>
              <td>{t('The full age-stratified results of the simulation')}</td>
              <td>TSV</td>
              <td>
                <Button
                  disabled={!(result?.trajectory.middle ?? null)}
                  onClick={() =>
                    result &&
                    exportResult({ scenarioState, result, filename: FILENAME_RESULTS_DETAILED, detailed: true })
                  }
                  color="primary"
                  size="sm"
                >
                  {t('Download')}
                </Button>
              </td>
            </tr>
            <tr>
              <td />
              <td>{t('Shareable link')}</td>
              <td>URL</td>
              <td>
                <ClipboardButton disabled={!(result?.trajectory ?? null)} textToCopy={shareableLink}>
                  {t('Copy link')}
                </ClipboardButton>
                <div>
                  <TwitterShareButton url={shareableLink}>
                    <TwitterIcon size={externalIconSize} round={isRoundIcon} />
                  </TwitterShareButton>
                  <EmailShareButton url={shareableLink}>
                    <EmailIcon size={externalIconSize} round={isRoundIcon} />
                  </EmailShareButton>
                  <FacebookShareButton url={shareableLink}>
                    <FacebookIcon size={externalIconSize} round={isRoundIcon} />
                  </FacebookShareButton>
                </div>
              </td>
            </tr>
            <tr>
              <td />
              <td>{t('Print Preview (to print or save as PDF)')}</td>
              <td>HTML</td>
              <td>
                <Button
                  disabled={!(result?.trajectory.middle ?? null)}
                  onClick={startPrinting}
                  color="primary"
                  size="sm"
                >
                  {t('Preview')}
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button
          color="secondary"
          disabled={!result}
          onClick={() =>
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
        >
          {t('Download all as zip')}
        </Button>
        <Button color="primary" onClick={toggleShowModal}>
          {t('Done')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
