import React, { useRef, useState } from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Table, Input } from 'reactstrap'
import { useTranslation } from 'react-i18next'

export interface ShareScenarioDialogProps {
  showModal: boolean
  toggleShowModal: () => void
  scenarioUrl: string
}

export default function ShareScenarioDialog({ showModal, toggleShowModal, scenarioUrl }: ShareScenarioDialogProps) {
  const { t } = useTranslation()

  const [copyStatus, setCopyStatus] = useState('')

  function copyToClipboard() {
    if (document.queryCommandSupported('copy')) {
      const textField = document.createElement('textarea')
      textField.innerText = scenarioUrl
      document.body.appendChild(textField)
      textField.select()
      document.execCommand('copy')
      textField.remove()
      setCopyStatus('Copied!')
    } else {
      setCopyStatus('Copy not supported in your browser!')
    }
  }

  function resetCopyStatus() {
    setCopyStatus('')
  }

  return (
    <Modal
      className="height-fit"
      centered
      size="lg"
      isOpen={showModal}
      toggle={toggleShowModal}
      onClosed={resetCopyStatus}
    >
      <ModalHeader toggle={toggleShowModal}>{t('Share Scenario')}</ModalHeader>
      <ModalBody>
        <Input label="Url to share" value={scenarioUrl} />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" type="submit" onClick={copyToClipboard}>
          Copy
        </Button>
        {copyStatus}
      </ModalFooter>
    </Modal>
  )
}
