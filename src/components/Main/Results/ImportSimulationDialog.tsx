import React, { useCallback, useState, useEffect } from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Alert } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import FileUploadZone from '../Compare/FileUploadZone'
import Papa from 'papaparse'
import processUserResult from '../../../algorithms/utils/userResult'
import { UserResult } from '../../../algorithms/types/Result.types'
import Message from '../../../components/Misc/Message'

export interface ImportSimulationDialogProps {
  showModal: boolean
  toggleShowModal: () => void
  onDataImported: (data: UserResult) => void
}

const allowedFileTypes = [
  'text/plain',
  'text/csv',
  'application/csv',
  'text/x-csv',
  'application/vnd.ms-excel',
  'text/tab-separated-values',
  'text/tsv',
  'application/tsv',
  '.csv',
  '.tsv',
]

export default function ImportSimulationDialog({
  toggleShowModal,
  showModal,
  onDataImported,
}: ImportSimulationDialogProps) {
  const { t } = useTranslation()
  const [filesToImport, setFilesToImport] = useState(new Map())
  const [errorMessage, setErrorMessage] = useState()

  const onImportRejected = () =>
    setErrorMessage(t('Error: {{message}}', { message: t('Only one CSV or TSV file can be imported.') }))

  const onImportClick = useCallback(async () => {
    if (filesToImport.size !== 1) {
      setErrorMessage(t('Only one file can be imported for now. Only the first one will be loaded.'))
    }

    const file: File = filesToImport.values().next().value
    const { data, errors, meta } = Papa.parse(file)

    if (meta.aborted || errors.length > 0) {
      setErrorMessage(
        t('Error: {{message}}', { message: t("The file could not be loaded. Make sure that it's a valid CSV file.") }),
      )
      return
    }

    onDataImported(processUserResult(data))
    toggleShowModal()
  }, [toggleShowModal])

  const isUploaded: boolean = filesToImport.size > 0

  return (
    <Modal className="height-fit" centered size="lg" isOpen={showModal} toggle={toggleShowModal}>
      <ModalHeader toggle={toggleShowModal}>{t('Import more data')}</ModalHeader>
      <ModalBody>
        <Message color="danger">{errorMessage}</Message>
        <p>
          {t('You can import your own data to display them along with the results of the simulation, allowing to compare the results of the model with real cases.')}
        </p>
        <FileUploadZone
          onFilesChange={setFilesToImport}
          accept={allowedFileTypes}
          multiple={false}
          disabled={isUploaded}
          onFilesRejected={onImportRejected}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggleShowModal}>
          {t('Cancel')}
        </Button>
        <Button color="primary" onClick={onImportClick} disabled={isUploaded}>
          {t('Import')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
