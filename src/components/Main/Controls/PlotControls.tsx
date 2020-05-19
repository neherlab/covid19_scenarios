import React from 'react'

import { useTranslation } from 'react-i18next'

import FormSwitch from '../../Form/FormSwitch'

export interface PlotControlsProps {
  isLogScale: boolean
  toggleLogScale(): void
  shouldFormatNumbers: boolean
  toggleFormatNumbers(): void
}

function PlotControls({ isLogScale, toggleLogScale, shouldFormatNumbers, toggleFormatNumbers }: PlotControlsProps) {
  const { t } = useTranslation()

  return (
    <>
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
    </>
  )
}

export { PlotControls }
