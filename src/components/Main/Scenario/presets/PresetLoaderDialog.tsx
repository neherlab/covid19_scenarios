import React, { useEffect, useState, KeyboardEvent } from 'react'

import { useTranslation } from 'react-i18next'
import { useDebouncedCallback } from 'use-debounce'
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Table,
  Input,
  InputGroup,
  InputGroupAddon,
  Col,
  Row,
  Container,
} from 'reactstrap'
import { MdClear } from 'react-icons/md'
import type { AnyAction } from 'typescript-fsa'

import type { SeverityDistributionDatum } from '../../../../algorithms/types/Param.types'

import LoadPresetDialogRow, { LoadPresetDialogRecordProps } from './PresetLoaderDialogRow'
import { ScenarioUploadDialog } from './ScenarioUploadDialog'

import './PresetLoader.scss'

const DEBOUNCE_DELAY = 500

export interface LoadPresetDialogProps {
  visible: boolean
  data: LoadPresetDialogRecordProps[]
  onLoadButtonClick: (id: string) => void
  onClose: () => void
  setSeverity(severity: SeverityDistributionDatum[]): void
  scenarioDispatch(action: AnyAction): void
}

const LoadPresetDialog = ({
  data,
  visible,
  onLoadButtonClick,
  onClose,
  setSeverity,
  scenarioDispatch,
}: LoadPresetDialogProps) => {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredRows, setFilteredRows] = useState(data)

  const executeFilter = (term: string) => {
    const hasSearchTerm = term.length > 0
    const filtered = hasSearchTerm ? data.filter((item) => item.label.toLowerCase().includes(term.toLowerCase())) : data

    setFilteredRows(filtered)
  }
  const [executeFilterDebounced] = useDebouncedCallback(executeFilter, DEBOUNCE_DELAY)

  useEffect(() => {
    if (visible) {
      /* TODO for some reason the useRef way doesn't work */
      setTimeout(() => {
        const element: HTMLInputElement | null = document.getElementById(
          'preset-loader-dialog-input',
        ) as HTMLInputElement

        if (element) {
          element.focus()
          element.select()
        }
      }, 0)
    }
  }, [visible])

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

  // TODO find out how to translate "Showing {0} out of {1} entries"
  return (
    <Modal
      id={'scenario-loader-modal'}
      centered
      isOpen={visible}
      toggle={onClose}
      fade={false}
      data-testid="PresetLoaderDialog"
    >
      <ModalHeader toggle={onClose}>{t(`Change scenario`)}</ModalHeader>

      <ModalBody>
        <Row className="scenario-loader-modal">
          <Col className="h-100" md={6}>
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
                <div className="preset-loader-dialog-table-container">
                  {filteredRows.map((item) => (
                    <LoadPresetDialogRow key={item.value} data={item} onLoadButtonClick={onLoadButtonClick} />
                  ))}
                </div>
              </Col>
            </Row>
          </Col>

          <Col md={6}>
            <ScenarioUploadDialog setSeverity={setSeverity} scenarioDispatch={scenarioDispatch} />
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  )
}

export default LoadPresetDialog
