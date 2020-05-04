import React from 'react'

import { useTranslation } from 'react-i18next'
import { Modal, ModalHeader, Col, Row, ModalBody } from 'reactstrap'

import type { AnyAction } from 'typescript-fsa'

import type { SeverityDistributionDatum } from '../../../algorithms/types/Param.types'

import { ScenarioOption } from './ScenarioLoaderListItem'

import { ScenarioLoaderCard } from './ScenarioLoaderCard'
import { ScenarioLoaderList } from './ScenarioLoaderList'
import { ScenarioLoaderUploader } from './ScenarioLoaderUploader'

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
      <ModalHeader toggle={onClose}>{t(`Change scenario`)}</ModalHeader>

      <ModalBody>
        <Row noGutters>
          <Col>
            <Row noGutters>
              <Col className="scenario-loader-section px-1 py-1" md={6}>
                <ScenarioLoaderCard header={<h3 className="text-center">{t(`Search predefined scenario`)}</h3>}>
                  <ScenarioLoaderList items={scenarioOptions} onScenarioSelect={onScenarioSelect} />
                </ScenarioLoaderCard>
              </Col>

              <Col className="scenario-loader-section px-1 py-1" md={6}>
                <ScenarioLoaderCard header={<h3 className="text-center">{t(`Load custom scenario`)}</h3>}>
                  <ScenarioLoaderUploader
                    setSeverity={setSeverity}
                    scenarioDispatch={scenarioDispatch}
                    close={onClose}
                  />
                </ScenarioLoaderCard>
              </Col>
            </Row>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  )
}
