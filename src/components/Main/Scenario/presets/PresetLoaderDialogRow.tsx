import React from 'react'

import { NavLink } from 'reactstrap'

import './PresetLoader.scss'

export interface LoadPresetDialogRecordProps {
  label: string
  value: string
}

export interface LoadPresetDialogRowProps {
  data: LoadPresetDialogRecordProps
  onLoadButtonClick: (id: string) => void
}

const PresetLoaderDialogRow = ({ data, onLoadButtonClick }: LoadPresetDialogRowProps) => {
  return (
    <div className="scenario-loader-row">
      <NavLink
        data-testid="PresetLoaderDialogRowLink"
        onClick={(event) => {
          event.preventDefault()
          onLoadButtonClick(data.value)
        }}
      >
        {data.label}
      </NavLink>
    </div>
  )
}

export default PresetLoaderDialogRow
