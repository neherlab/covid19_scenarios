import React, { useState, useCallback } from 'react'

import { useTranslation } from 'react-i18next'
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'

import { ScenarioLoaderCard } from './ScenarioLoaderCard'
import { ScenarioLoaderList } from './ScenarioLoaderList'
import { ScenarioLoaderUploader } from './ScenarioLoaderUploader'

export function ScenarioLoader() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [setIsOpen])
  const close = useCallback(() => setIsOpen(false), [setIsOpen])

  return (
    <>
      <Button
        className="scenario-loader-button"
        color="primary"
        size="sm"
        data-testid="PresetLoaderButton"
        onClick={open}
      >
        {t('Load')}
      </Button>

      <Modal
        className="scenario-loader-modal"
        centered
        isOpen={isOpen}
        toggle={close}
        fade={false}
        data-testid="PresetLoaderDialog"
        autoFocus={false}
      >
        <ModalHeader toggle={close}>{t(`Change scenario`)}</ModalHeader>

        <ModalBody>
          <Row noGutters>
            <Col className="scenario-loader-section px-1 py-1" md={6}>
              <ScenarioLoaderCard
                className="scenario-loader-card-list"
                header={<h3 className="text-center">{t(`Search predefined scenario`)}</h3>}
              >
                <ScenarioLoaderList close={close} />
              </ScenarioLoaderCard>
            </Col>

            <Col className="scenario-loader-section px-1 py-1" md={6}>
              <ScenarioLoaderCard
                className="scenario-loader-card-uploader"
                header={<h3 className="text-center">{t(`Load custom scenario`)}</h3>}
              >
                <ScenarioLoaderUploader close={close} />
              </ScenarioLoaderCard>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  )
}
