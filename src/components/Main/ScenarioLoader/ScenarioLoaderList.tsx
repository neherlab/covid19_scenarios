import React, { HTMLProps, KeyboardEvent, useState } from 'react'

import { partition } from 'lodash'

import { useTranslation } from 'react-i18next'
import { MdClear } from 'react-icons/md'
import { Button, Col, Container, Input, InputGroup, InputGroupAddon, Row } from 'reactstrap'
import { useDebouncedCallback } from 'use-debounce'

import './ScenarioLoader.scss'

import { ScenarioLoaderListItem, ScenarioOption } from './ScenarioLoaderListItem'

const DEBOUNCE_DELAY = 500

export interface ScenarioLoaderListProps extends HTMLProps<HTMLDivElement> {
  items: ScenarioOption[]
  onScenarioSelect(scenario: string): void
}

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

export function ScenarioLoaderList({ items, onScenarioSelect }: ScenarioLoaderListProps) {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredRows, setFilteredRows] = useState(items)

  const executeFilter = (term: string) => {
    const hasSearchTerm = term.length > 0
    const filtered = hasSearchTerm ? searchOptions(items, term) : items
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
    <Container>
      <Row noGutters>
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

      <Row noGutters>
        <Col>
          <div className="overflow-y-scroll">
            {filteredRows.map((item) => (
              <ScenarioLoaderListItem key={item.value} option={item} onItemClick={onScenarioSelect} />
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  )
}
