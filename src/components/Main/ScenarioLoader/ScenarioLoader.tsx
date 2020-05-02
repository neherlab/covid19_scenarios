import React from 'react'

import { useTranslation } from 'react-i18next'
import { Modal, ModalBody, ModalHeader, Col, Row } from 'reactstrap'

import type { AnyAction } from 'typescript-fsa'

import type { SeverityDistributionDatum } from '../../../algorithms/types/Param.types'

import { ScenarioOption } from './ScenarioLoaderListItem'

import { ScenarioLoaderCustom } from './ScenarioLoaderCustom'
import { ScenarioLoaderList } from './ScenarioLoaderList'

import './ScenarioLoader.scss'

export interface ScenarioLoaderProps {
  visible: boolean
  scenarioOptions: ScenarioOption[]
  onScenarioSelect: (id: string) => void
  onClose: () => void
  setSeverity(severity: SeverityDistributionDatum[]): void
  scenarioDispatch(action: AnyAction): void
}

export function ScenarioLoader({
  scenarioOptions,
  visible,
  onScenarioSelect,
  onClose,
  setSeverity,
  scenarioDispatch,
}: ScenarioLoaderProps) {
  const { t } = useTranslation()

  return (
    <Modal
      id={'scenario-loader-modal'}
      centered
      isOpen={visible}
      toggle={onClose}
      fade={false}
      data-testid="PresetLoaderDialog"
    >
      <ModalHeader toggle={onClose}>{t(`Change scenario`)}</ModalHeader>

      <ModalBody>
        <Row className="scenario-loader-modal">
          <Col className="h-100" md={6}>
            <ScenarioLoaderList items={scenarioOptions} onScenarioSelect={onScenarioSelect} hidden={!visible} />
          </Col>

          <Col md={6}>
            <ScenarioLoaderCustom setSeverity={setSeverity} scenarioDispatch={scenarioDispatch} />
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  )
}
