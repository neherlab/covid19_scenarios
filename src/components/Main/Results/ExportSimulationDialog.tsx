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

import type { SeverityDistributionDatum } from '../../../algorithms/types/Param.types'
import type { AlgorithmResult } from '../../../algorithms/types/Result.types'
import { exportAll, exportScenario, exportResult } from '../../../algorithms/utils/exportResult'

import ClipboardButton from '../../Buttons/ClipboardButton'

import { State } from '../state/state'

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

  // Assuming href and shareable link can be concatenated without other processing:
  const shareableLink = `${window.location.href}${scenarioUrl}`

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
              <td>covid.params.json</td>
              <td>{t('The simulation parameters')}</td>
              <td>JSON</td>
              <td>
                <Button
                  onClick={() => exportScenario({ scenarioState, severity, severityName })}
                  color="primary"
                  size="sm"
                >
                  {t('Download')}
                </Button>
              </td>
            </tr>
            <tr>
              <td>covid.summary.tsv</td>
              <td>{t('The summarized results of the simulation')}</td>
              <td>TSV</td>
              <td>
                <Button
                  disabled={!(result?.trajectory.middle ?? null)}
                  onClick={() => result && exportResult({ scenarioState, result, detailed: false })}
                  color="primary"
                  size="sm"
                >
                  {t('Download')}
                </Button>
              </td>
            </tr>
            <tr>
              <td>covid.allresults.tsv</td>
              <td>{t('The full age-stratified results of the simulation')}</td>
              <td>TSV</td>
              <td>
                <Button
                  disabled={!(result?.trajectory.middle ?? null)}
                  onClick={() => result && exportResult({ scenarioState, result, detailed: true })}
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
          onClick={() => exportAll({ scenarioState, severity, severityName, result })}
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
