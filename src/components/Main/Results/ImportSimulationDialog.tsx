import React, { useCallback, useState } from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { useTranslation, getI18n } from 'react-i18next'
import Papa from 'papaparse'
import FileUploadZone, { FileType } from '../Compare/FileUploadZone'
import processUserResult from '../../../algorithms/utils/userResult'
import { UserResult } from '../../../algorithms/types/Result.types'
import Message from '../../../components/Misc/Message'
import { ProcessingError, ProcessingErrorCode } from '../../../algorithms/utils/exceptions'

export interface ImportSimulationDialogProps {
  showModal: boolean
  toggleShowModal(): void
  onDataImported(data: UserResult): void
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

function getMessageForError(error: ProcessingError): string {
  let message
  switch (error.errorCode) {
    case ProcessingErrorCode.MissingTimeField:
      message = getI18n().t('The time field is missing.')
      break
    case ProcessingErrorCode.InvalidField:
      message = getI18n().t('{{value}} is not a valid field value.', { value: error.message })
      break
    default:
      throw new Error('Unknown processing error.')
  }

  return getI18n().t('Error: {{message}}', { message })
}

export default function ImportSimulationDialog({
  toggleShowModal,
  showModal,
  onDataImported,
}: ImportSimulationDialogProps) {
  const { t } = useTranslation()
  const [filesToImport, setFilesToImport] = useState<Map<FileType, File>>(new Map())
  const [errorMessage, setErrorMessage] = useState<string>()

  const onImportRejected = () =>
    setErrorMessage(t('Error: {{message}}', { message: t('Only one CSV or TSV file can be imported.') }))

  const onImportClick = useCallback(async () => {
    if (filesToImport.size === 0) {
      setErrorMessage(t('Error: {{message}}', { message: t('No file has been uploaded.') }))
      return
    }

    const file: File = filesToImport.values().next().value
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      complete: ({ data, errors, meta }: Papa.ParseResult) => {
        if (meta.aborted || !data?.length) {
          // TODO display more detailed information to the user in case of error
          setErrorMessage(
            t('Error: {{message}}', {
              message: t("The file could not be loaded. Make sure that it's a valid CSV file."),
            }),
          )

          // TODO log only in dev mode
          console.error('Parsing error', errors)
          return
        }

        try {
          onDataImported(processUserResult(data))
        } catch (error) {
          setErrorMessage(getMessageForError(error))
          return
        }

        toggleShowModal()
      },
    })

    // TODO handle loading for huge files
  }, [toggleShowModal, filesToImport])

  const isFileUploaded: boolean = filesToImport.size > 0

  return (
    <Modal className="height-fit" centered size="lg" isOpen={showModal} toggle={toggleShowModal}>
      <ModalHeader toggle={toggleShowModal}>{t('Import more data')}</ModalHeader>
      <ModalBody>
        <Message color="danger">{errorMessage}</Message>
        <p>
          {t('You can import your own data to display them along with the results of the simulation, allowing to compare the results of the model with real cases.')}
        </p>
        <FileUploadZone
          onFilesUploaded={setFilesToImport}
          accept={allowedFileTypes}
          multiple={false}
          onFilesRejected={onImportRejected}
          dropZoneMessage={t('Drag and drop a file here, or click to select one.')}
          activeDropZoneMessage={t('Drop the file here...')}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggleShowModal}>
          {t('Cancel')}
        </Button>
        <Button color="primary" onClick={onImportClick} disabled={!isFileUploaded}>
          {t('Import')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
