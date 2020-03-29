import React, { useState, useEffect } from 'react'
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Form,
  FormGroup,
  Tooltip,
} from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { FaRegClipboard } from 'react-icons/fa'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useDebouncedCallback } from 'use-debounce'

import { ActiveScenario } from '.'
import { DEFAULT_SCENARIO_ID } from '../Main/state/state'

export interface ShareScenarioDialogProps {
  scenario: ActiveScenario
  createdBy: string
  generateLink(name: string, createdBy: string): string
  onCloseDialog: () => void
}

export default function ShareScenarioDialog({
  scenario,
  createdBy: createdByProp,
  generateLink,
  onCloseDialog,
}: ShareScenarioDialogProps) {
  const [scenarioName, setScenarioName] = useState<string>(scenario.id === DEFAULT_SCENARIO_ID ? '' : scenario.name)
  const [createdBy, setCreatedBy] = useState<string>(createdByProp)
  const [shareableLink, setShareableLink] = useState<string>('')
  const [linkCopied, setLinkCopied] = useState<boolean>(false)

  const { t } = useTranslation()

  const [debouncedUpdate] = useDebouncedCallback(() => setShareableLink(generateLink(scenarioName, createdBy)), 500)

  useEffect(() => {
    if (scenarioName && createdBy) {
      debouncedUpdate()
    }
  }, [scenarioName, createdBy, generateLink, debouncedUpdate])

  return (
    <Modal isOpen centered size="md" toggle={onCloseDialog} className="share-scenario-dialog">
      <Form>
        <ModalHeader toggle={onCloseDialog}>{t('Get a shareable link for this scenario')}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="scenarioName">{t('Scenario Name')}</Label>
            <Input
              type="text"
              name="scenarioName"
              id="scenarioName"
              placeholder={t('Give the scenario a name')}
              required
              value={scenarioName}
              onChange={(e) => {
                setScenarioName(e.target.value)
                setLinkCopied(false)
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label for="createdBy">{t('Created By')}</Label>
            <Input
              type="text"
              name="createdBy"
              id="createdBy"
              placeholder={t('Enter your name or email')}
              required
              value={createdBy}
              onChange={(e) => {
                setCreatedBy(e.target.value)
                setLinkCopied(false)
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label for="shareableLink">{t('Shareable Link')}</Label>
            <InputGroup>
              <Input type="text" name="shareableLink" id="shareableLink" value={shareableLink} readOnly tabIndex={-1} />
              <InputGroupAddon addonType="append">
                <CopyToClipboard text={shareableLink} onCopy={() => setLinkCopied(true)}>
                  <Button disabled={!shareableLink} id="copyLink">
                    <FaRegClipboard />
                  </Button>
                </CopyToClipboard>
              </InputGroupAddon>
              <Tooltip placement="right" isOpen={linkCopied} target="copyLink" toggle={() => setLinkCopied(false)}>
                {t('Copied!')}
              </Tooltip>
            </InputGroup>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button type="button" onClick={onCloseDialog}>
            {t('Close')}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}
