import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'reactstrap'
import { LoadPresetDialogRecordProps } from './PresetLoaderDialogRow'
import PresetLoaderDialog from './PresetLoaderDialog'
import './PresetLoader.scss'

interface LoadPresetButtonProps {
  data: LoadPresetDialogRecordProps[]
  disabled?: boolean
  onSelect: (id: string) => void
}

const PresetLoader = ({ data, onSelect }: LoadPresetButtonProps) => {
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
      {t('Load scenario')}
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
