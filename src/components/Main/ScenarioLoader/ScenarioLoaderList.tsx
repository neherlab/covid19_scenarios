import React, { HTMLProps, KeyboardEvent, useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { MdClear } from 'react-icons/md'
import { Button, Col, Input, InputGroup, InputGroupAddon, Row } from 'reactstrap'
import { useDebouncedCallback } from 'use-debounce'

import { ScenarioLoaderListItem, ScenarioOption } from './ScenarioLoaderListItem'

import './ScenarioLoader.scss'

const DEBOUNCE_DELAY = 500

export interface ScenarioLoaderListProps extends HTMLProps<HTMLDivElement> {
  items: ScenarioOption[]
  onScenarioSelect(scenario: string): void
}

export function ScenarioLoaderList({ items, onScenarioSelect }: ScenarioLoaderListProps) {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredRows, setFilteredRows] = useState(items)

  const executeFilter = (term: string) => {
    const hasSearchTerm = term.length > 0
    const filtered = hasSearchTerm
      ? items.filter((item) => item.label.toLowerCase().includes(term.toLowerCase()))
      : items

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
    <>
      <Row className="mb-2">
        <Col>
          <InputGroup>
            <Input
              className="input-search-scenario"
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
        </Col>
      </Row>

      <Row className="h-100">
        <Col className="h-100">
          <div className="mh-100 overflow-y-scroll">
            {filteredRows.map((item) => (
              <ScenarioLoaderListItem key={item.value} option={item} onItemClick={onScenarioSelect} />
            ))}
          </div>
        </Col>
      </Row>
    </>
  )
}
