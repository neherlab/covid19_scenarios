import React from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { useTranslation } from 'react-i18next'

export interface SaveScenarioDialogProps {
  onCloseDialog: () => void
}

export default function SaveScenarioDialog({ onCloseDialog }: SaveScenarioDialogProps) {
  const { t } = useTranslation()

  return (
    <Modal isOpen centered size="md" toggle={onCloseDialog}>
      <ModalHeader toggle={onCloseDialog}>{t('Save scenario')}</ModalHeader>
      <ModalBody>FORM</ModalBody>
      <ModalFooter>
        <Button>{t('Save')}</Button>
      </ModalFooter>
    </Modal>
  )
}
