import React, { HTMLProps, useState, useMemo } from 'react'

import { useTranslation } from 'react-i18next'
import type { AnyAction } from 'typescript-fsa'
import { Button } from 'reactstrap'

import type { SeverityDistributionDatum } from '../../../algorithms/types/Param.types'
import type { ScenarioOption } from './ScenarioOption'

import { ScenarioLoader } from './ScenarioLoader'

import './ScenarioLoader.scss'

interface ScenarioLoaderModalButtonProps extends HTMLProps<HTMLButtonElement> {}

export function ScenarioLoaderModalButton({ scenarioNames }: ScenarioLoaderModalButtonProps) {
  const { t } = useTranslation()
  const [showDialog, setShowDialog] = useState(false)

  const scenarioOptions = useMemo(stringsToOptions(scenarioNames), [scenarioNames])

  return (
    <>
      <Button
        className="scenario-loader-button"
        color="primary"
        size="sm"
        data-testid="PresetLoaderButton"
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
