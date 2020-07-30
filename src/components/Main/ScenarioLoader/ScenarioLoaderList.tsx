import React, { HTMLProps, KeyboardEvent, useCallback, useMemo, useState } from 'react'

import { partition } from 'lodash'

import { useTranslation } from 'react-i18next'
import { MdClear } from 'react-icons/md'
import { connect } from 'react-redux'
import { Button, Input, InputGroup, InputGroupAddon } from 'reactstrap'
import { ActionCreator } from 'typescript-fsa'
import { useDebouncedCallback } from 'use-debounce'

import { State } from '../../../state/reducer'
import { SetScenarioParams, setScenario } from '../../../state/scenario/scenario.actions'
import { selectScenarioNames } from '../../../state/scenario/scenario.selectors'
import { stringsToOptions } from '../../Form/FormDropdownOption'

import { ScenarioLoaderListItem } from './ScenarioLoaderListItem'
import type { ScenarioOption } from './ScenarioOption'

const DEBOUNCE_DELAY = 500

export function includesLowerCase(candidate: string, searchTerm: string): boolean {
  return candidate.toLowerCase().includes(searchTerm.toLowerCase())
}

export function startsWithLowerCase(candidate: string, searchTerm: string): boolean {
  return candidate.toLowerCase().startsWith(searchTerm.toLowerCase())
}

export function searchOptions(items: ScenarioOption[], term: string): ScenarioOption[] {
  const [itemsStartWith, itemsNotStartWith] = partition(items, ({ label }) => startsWithLowerCase(label, term))
  const [itemsInclude] = partition(itemsNotStartWith, ({ label }) => includesLowerCase(label, term))
  return [...itemsStartWith, ...itemsInclude]
}

export interface ScenarioLoaderListProps extends HTMLProps<HTMLDivElement> {
  scenarioNames: string[]
  setScenario: ActionCreator<SetScenarioParams>
  close(): void
}

const mapStateToProps = (state: State) => ({
  scenarioNames: selectScenarioNames(state),
})

const mapDispatchToProps = {
  setScenario,
}

export const ScenarioLoaderList = connect(mapStateToProps, mapDispatchToProps)(ScenarioLoaderListDisconnected)

export function ScenarioLoaderListDisconnected({ scenarioNames, setScenario, close }: ScenarioLoaderListProps) {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const scenarioOptions = useMemo(() => stringsToOptions(scenarioNames), [scenarioNames])
  const [filteredRows, setFilteredRows] = useState(scenarioOptions)

  const onScenarioSelect = useCallback(
    (scenarioName: string) => {
      setScenario({ name: scenarioName })
      close()
    },
    [close, setScenario],
  )

  const executeFilter = (term: string) => {
    const hasSearchTerm = term.length > 0
    const filtered = hasSearchTerm ? searchOptions(scenarioOptions, term) : scenarioOptions
    setFilteredRows(filtered)
  }
  const [executeFilterDebounced] = useDebouncedCallback(executeFilter, DEBOUNCE_DELAY)

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    setSearchTerm(value)
    executeFilterDebounced(value)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const isEnterKey = event.keyCode === 13

    if (isEnterKey) {
      executeFilter(searchTerm)
    }
  }

  return (
    <div className="scenario-loader-list-container">
      <InputGroup className="scenario-loader-list-input-group">
        <Input
          className="scenario-loader-list-search-input"
          name="search-scenario"
          data-testid="PresetLoaderDialogInput"
          placeholder={t('Search')}
          onChange={onChange}
          value={searchTerm}
          autoComplete="off"
          onKeyDown={onKeyDown}
          autoFocus
        />
        <InputGroupAddon addonType="append">
          <Button
            color="secondary"
            className="btn-search-scenario"
            data-testid="PresetLoaderDialogClearButton"
            disabled={searchTerm === ''}
            onClick={() => {
              setSearchTerm('')
              executeFilter('')
            }}
          >
            <MdClear />
          </Button>
        </InputGroupAddon>
      </InputGroup>

      <div className="mt-2 scenario-loader-list">
        {filteredRows.map((item) => (
          <ScenarioLoaderListItem key={item.value} option={item} onItemClick={onScenarioSelect} />
        ))}
      </div>
    </div>
  )
}
