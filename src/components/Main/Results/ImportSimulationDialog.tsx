import React, { useCallback } from 'react'
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

  const onImportClick = useCallback(
    () => {
      importFiles()
      toggleShowModal()
    },
    [toggleShowModal]
  );

  return (
    <Modal className="height-fit" centered size="lg" isOpen={showModal} toggle={toggleShowModal}>
      <ModalHeader toggle={toggleShowModal}>{t('Import more data')}</ModalHeader>
      <ModalBody>
        <p>{t('You can import your own data to display them along with the results of the simulation, allowing to compare the results of the model with real cases.')}</p>
        <FileUploadZone onFilesChange={onImport} />
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
