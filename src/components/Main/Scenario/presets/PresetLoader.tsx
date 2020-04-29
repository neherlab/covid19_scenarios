import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'
import type { AnyAction } from 'typescript-fsa'
import { Button } from 'reactstrap'

import type { SeverityDistributionDatum } from '../../../../algorithms/types/Param.types'

import { LoadPresetDialogRecordProps } from './PresetLoaderDialogRow'
import PresetLoaderDialog from './PresetLoaderDialog'

import './PresetLoader.scss'

interface LoadPresetButtonProps {
  data: LoadPresetDialogRecordProps[]
  disabled?: boolean
  onSelect: (id: string) => void
  setSeverity(severity: SeverityDistributionDatum[]): void
  scenarioDispatch(action: AnyAction): void
}

const PresetLoader = ({ data, onSelect, setSeverity, scenarioDispatch }: LoadPresetButtonProps) => {
  const { t } = useTranslation()
  const [showDialog, setShowDialog] = useState(false)
  const button = (
    <Button
      className="preset-loader-button"
      color="primary"
      size="sm"
      data-testid="PresetLoaderButton"
      onClick={() => setShowDialog(true)}
    >
      {t('Change scenario')}
    </Button>
  )
  const dialog = (
    <PresetLoaderDialog
      data={data}
      visible={showDialog}
      onLoadButtonClick={(id: string) => {
        onSelect(id)
        setShowDialog(false)
      }}
      onClose={() => {
        setShowDialog(false)
      }}
      setSeverity={setSeverity}
      scenarioDispatch={scenarioDispatch}
    />
  )
  return (
    <>
      {button}
      {dialog}
    </>
  )
}

export default PresetLoader
