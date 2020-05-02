import React from 'react'

import { NavLink } from 'reactstrap'

import './ScenarioLoader.scss'

export interface ScenarioOption {
  label: string
  value: string
}

export interface ScenarioLoaderListItemProps {
  option: ScenarioOption
  onItemClick: (id: string) => void
}

export function ScenarioLoaderListItem({ option, onItemClick }: ScenarioLoaderListItemProps) {
  return (
    <div className="scenario-loader-row">
      <NavLink
        data-testid="PresetLoaderDialogRowLink"
        onClick={(event) => {
          event.preventDefault()
          onItemClick(option.value)
        }}
      >
        {option.label}
      </NavLink>
    </div>
  )
}
