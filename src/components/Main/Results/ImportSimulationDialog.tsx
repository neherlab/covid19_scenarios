import React from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import FileUploadZone, { FileType } from '../Compare/FileUploadZone'

export interface ImportSimulationDialogProps {
  showModal: boolean
  toggleShowModal: () => void
}

let filesToImport = null;

const onImport = (uploadedFiles: Map<FileType, File>) => filesToImport = uploadedFiles
const importFiles = () => {

}

export default function ImportSimulationDialog({ toggleShowModal, showModal }: ImportSimulationDialogProps) {
  const { t } = useTranslation()

  const onImportClick = () => {
    importFiles()
    toggleShowModal()
  }

  return (
    <Modal className="height-fit" centered size="lg" isOpen={showModal} toggle={toggleShowModal}>
      <ModalHeader toggle={toggleShowModal}>{t('Import simulation')}</ModalHeader>
      <ModalBody>
        <FileUploadZone files={new Map()} onFilesChange={onImport} />
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggleShowModal}>
          {t('Cancel')}
        </Button>
        <Button color="primary" onClick={onImportClick}>
          {t('Import')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
