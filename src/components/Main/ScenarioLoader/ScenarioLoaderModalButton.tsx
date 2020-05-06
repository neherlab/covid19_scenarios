import React, { HTMLProps, useState } from 'react'

import { useTranslation } from 'react-i18next'
import type { AnyAction } from 'typescript-fsa'
import { Button } from 'reactstrap'

import type { SeverityDistributionDatum } from '../../../algorithms/types/Param.types'

import { ScenarioOption } from './ScenarioLoaderListItem'
import { ScenarioLoader } from './ScenarioLoader'

import './ScenarioLoader.scss'

interface ScenarioLoaderModalButtonProps extends HTMLProps<HTMLButtonElement> {
  scenarioOptions: ScenarioOption[]
  onScenarioSelect: (id: string) => void
  setSeverity(severity: SeverityDistributionDatum[]): void
  scenarioDispatch(action: AnyAction): void
}

export function ScenarioLoaderModalButton({
  disabled,
  scenarioOptions,
  onScenarioSelect,
  setSeverity,
  scenarioDispatch,
}: ScenarioLoaderModalButtonProps) {
  const { t } = useTranslation()
  const [showDialog, setShowDialog] = useState(false)

  return (
    <>
      <Button
        className="scenario-loader-button"
        color="primary"
        size="sm"
        data-testid="PresetLoaderButton"
        disabled={disabled}
        onClick={() => setShowDialog(true)}
      >
        {t('Load')}
      </Button>

      <ScenarioLoader
        scenarioOptions={scenarioOptions}
        onScenarioSelect={(id: string) => {
          onScenarioSelect(id)
          setShowDialog(false)
        }}
        onClose={() => {
          setShowDialog(false)
        }}
        setSeverity={setSeverity}
        scenarioDispatch={scenarioDispatch}
        visible={showDialog}
      />
    </>
  )
}
