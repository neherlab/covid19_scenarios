import React from 'react'

import { NavLink } from 'reactstrap'

import type { ScenarioOption } from './ScenarioOption'

export interface ScenarioLoaderListItemProps {
  option: ScenarioOption
  onItemClick: (id: string) => void
}

export function ScenarioLoaderListItem({ option, onItemClick }: ScenarioLoaderListItemProps) {
  return (
    <div className="scenario-loader-list-item">
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
