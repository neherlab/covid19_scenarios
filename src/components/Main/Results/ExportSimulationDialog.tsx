import React from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { AlgorithmResult } from '../../../algorithms/types/Result.types'
import { exportAll, exportParams, exportResult } from '../../../algorithms/utils/exportResult'
import ClipboardButton from '../../Buttons/ClipboardButton'

export interface ExportSimulationDialogProps {
  canExport: boolean
  showModal: boolean
  toggleShowModal: () => void
  openPrintPreview: () => void
  result?: AlgorithmResult
  scenarioUrl: string
}

export default function ExportSimulationDialog({
  showModal,
  toggleShowModal,
  openPrintPreview,
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
                  disabled={!(result?.params ?? null)}
                  onClick={() => result && exportParams(result)}
                  color="primary"
                  size="sm"
                >
                  {t('Download')}
                </Button>
              </td>
            </tr>
            <tr>
              <td>covid.results.deterministic.tsv</td>
              <td>{t('The deterministic results of the simulation')}</td>
              <td>TSV</td>
              <td>
                <Button
                  disabled={!(result?.deterministic ?? null)}
                  onClick={() => result && exportResult(result)}
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
                <ClipboardButton disabled={!(result?.params ?? null)} textToCopy={shareableLink}>
                  {t('Copy link')}
                </ClipboardButton>
              </td>
            </tr>
            <tr>
              <td />
              <td>{t('Print Preview (to print or save as PDF)')}</td>
              <td>HTML</td>
              <td>
                <Button disabled={!(result?.deterministic ?? null)} onClick={startPrinting} color="primary" size="sm">
                  {t('Preview')}
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" disabled={!result} onClick={() => result && exportAll(result)}>
          {t('Download all as zip')}
        </Button>
        <Button color="primary" onClick={toggleShowModal}>
          {t('Done')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
