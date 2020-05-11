import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Button, Col, Modal, ModalBody, ModalHeader, Row, ModalFooter } from 'reactstrap'
import { MdSettings } from 'react-icons/md'

import FormSwitch from '../../Form/FormSwitch'

import './ModalButtonSettings.scss'

export interface ModalbuttonSettingsProps {
  buttonSize: number
  isLogScale: boolean
  toggleLogScale(): void
  shouldFormatNumbers: boolean
  toggleFormatNumbers(): void
  isAutorunEnabled: boolean
  toggleAutorun(): void
}

function ModalbuttonSettings({
  buttonSize,
  isLogScale,
  toggleLogScale,
  shouldFormatNumbers,
  toggleFormatNumbers,
  isAutorunEnabled,
  toggleAutorun,
}: ModalbuttonSettingsProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  function toggleOpen() {
    setIsOpen(!isOpen)
  }

  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  return (
    <>
      <Button
        className="btn-simulation-controls btn-settings"
        type="button"
        onClick={open}
        title={t('Customization settings')}
      >
        <MdSettings size={buttonSize} />
        <div>{t('Settings')}</div>
      </Button>
      <Modal className="settings-modal" centered isOpen={isOpen} toggle={toggleOpen} fade={false} autoFocus={false}>
        <ModalHeader toggle={close}>
          <MdSettings size={20} />
          <span className="ml-2">{t('Settings')}</span>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <div className="mr-4" data-testid="AutorunSwitch">
                <FormSwitch
                  identifier="autorun"
                  label={t('Run automatically')}
                  help={t('Run simulation automatically on parameter change')}
                  checked={isAutorunEnabled}
                  onValueChanged={toggleAutorun}
                />
              </div>
              <div className="mr-4" data-testid="LogScaleSwitch">
                <FormSwitch
                  identifier="logScale"
                  label={t('Log scale')}
                  help={t('Toggle between logarithmic and linear scale on vertical axis of the plot')}
                  checked={isLogScale}
                  onValueChanged={toggleLogScale}
                />
              </div>
              <div data-testid="HumanizedValuesSwitch">
                <FormSwitch
                  identifier="showHumanized"
                  label={t('Format numbers')}
                  help={t('Show numerical results in a human friendly format')}
                  checked={shouldFormatNumbers}
                  onValueChanged={toggleFormatNumbers}
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Col className="text-right">
              <small>{t('Note that these settings are applied instantly upon change')}</small>
            </Col>
          </Row>
        </ModalBody>

        <ModalFooter>
          <Button className="close-button" type="button" onClick={close} title={t('OK')}>
            <div>{t('Close')}</div>
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export { ModalbuttonSettings }
