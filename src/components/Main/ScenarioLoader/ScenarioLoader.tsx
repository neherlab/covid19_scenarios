import React from 'react'

import { useTranslation } from 'react-i18next'
import { Modal, ModalBody, ModalHeader, Col, Row, Container } from 'reactstrap'

import type { AnyAction } from 'typescript-fsa'

import type { SeverityDistributionDatum } from '../../../algorithms/types/Param.types'

import { ScenarioOption } from './ScenarioLoaderListItem'

import { ScenarioLoaderUploader } from './ScenarioLoaderUploader'
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
      autoFocus={false}
    >
      <Row>
        <Col>
          <ModalHeader toggle={onClose}>{t(`Change scenario`)}</ModalHeader>
        </Col>
      </Row>

      <Row className="h-100">
        <Col className="h-100">
          <Row className="h-100">
            <Col className="scenario-loader-section" md={6}>
              <ScenarioLoaderList items={scenarioOptions} onScenarioSelect={onScenarioSelect} />
            </Col>

            <Col className="scenario-loader-section" md={6}>
              <ScenarioLoaderUploader setSeverity={setSeverity} scenarioDispatch={scenarioDispatch} close={onClose} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Modal>
  )
}
