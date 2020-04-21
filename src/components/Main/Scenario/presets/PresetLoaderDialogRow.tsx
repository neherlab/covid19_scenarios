/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'reactstrap'
import './PresetLoaderDialog.scss'

export interface LoadPresetDialogRecordProps {
  label: string
  value: string
}

export interface LoadPresetDialogRowProps {
  data: LoadPresetDialogRecordProps
  onLoadButtonClick: (id: string) => void
}

const PresetLoaderDialogRow = ({ data, onLoadButtonClick }: LoadPresetDialogRowProps) => {
  const { t } = useTranslation()

  return (
    <tr className="preset-loader-dialog-row">
      <td className="preset-loader-dialog-row-label">
        <a
          data-testid="PresetLoaderDialogRowLink"
          href="#"
          onClick={(event) => {
            event.preventDefault()
            onLoadButtonClick(data.value)
          }}
        >
          {data.label}
        </a>
      </td>
      <td>
        <Button
          data-testid="PresetLoaderDialogRowButton"
          onClick={() => {
            onLoadButtonClick(data.value)
          }}
        >
          {t('Load')}
        </Button>
      </td>
    </tr>
  )
}

export default PresetLoaderDialogRow
