import React from 'react'

import { useTranslation } from 'react-i18next'
import { Col, Row } from 'reactstrap'

import FormSwitch from '../../Form/FormSwitch'

import './ModalButtonSettings.scss'

export interface ModalbuttonSettingsProps {
  isLogScale: boolean
  toggleLogScale(): void
  shouldFormatNumbers: boolean
  toggleFormatNumbers(): void
  isAutorunEnabled: boolean
  toggleAutorun(): void
}

function SettingsControls({
  isLogScale,
  toggleLogScale,
  shouldFormatNumbers,
  toggleFormatNumbers,
  isAutorunEnabled,
  toggleAutorun,
}: ModalbuttonSettingsProps) {
  const { t } = useTranslation()

  return (
    <Row noGutters className="mt-1 ml-2">
      <Col className="d-flex my-auto">
        <span className="mr-4" data-testid="AutorunSwitch">
          <FormSwitch
            identifier="autorun"
            label={t('Run automatically')}
            help={t('Run simulation automatically when any of the parameters change')}
            checked={isAutorunEnabled}
            onValueChanged={toggleAutorun}
          />
        </span>
        <span className="mr-4" data-testid="LogScaleSwitch">
          <FormSwitch
            identifier="logScale"
            label={t('Log scale')}
            help={t('Toggle between logarithmic and linear scale on vertical axis of the plot')}
            checked={isLogScale}
            onValueChanged={toggleLogScale}
          />
        </span>
        <span data-testid="HumanizedValuesSwitch">
          <FormSwitch
            identifier="showHumanized"
            label={t('Format numbers')}
            help={t('Show numerical results in a human-friendly format')}
            checked={shouldFormatNumbers}
            onValueChanged={toggleFormatNumbers}
          />
        </span>
      </Col>
    </Row>
  )
}

export { SettingsControls }
