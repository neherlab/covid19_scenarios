import React, { useState } from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Input, Label, Form, FormGroup } from 'reactstrap'
import { useTranslation } from 'react-i18next'

export interface SaveScenarioDialogProps {
  onSave: (name: string) => void
  onCloseDialog: () => void
}

export default function SaveScenarioDialog({ onSave, onCloseDialog }: SaveScenarioDialogProps) {
  const [scenarioName, setScenarioName] = useState<string>('')
  const { t } = useTranslation()

  return (
    <Modal isOpen centered size="md" toggle={onCloseDialog}>
      <Form onSubmit={(e) => onSave(scenarioName)}>
        <ModalHeader toggle={onCloseDialog}>{t('Save scenario')}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="scenarioName">Scenario Name</Label>
            <Input
              type="text"
              name="scenarioName"
              id="scenarioName"
              placeholder={t('Give the scenario a name')}
              required
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" color="primary" disabled={!scenarioName}>
            {t('Save')}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}
