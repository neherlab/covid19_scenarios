import React, { useEffect, useState, KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useDebouncedCallback } from 'use-debounce'
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
  Input,
  InputGroup,
  InputGroupAddon,
} from 'reactstrap'
import LoadPresetDialogRow, { LoadPresetDialogRecordProps } from './PresetLoaderDialogRow'
import './PresetLoaderDialog.scss'

const DEBOUNCE_DELAY = 500

export interface LoadPresetDialogProps {
  visible: boolean
  data: LoadPresetDialogRecordProps[]
  onLoadButtonClick: (id: string) => void
  onClose: () => void
}

const LoadPresetDialog = ({ data, visible, onLoadButtonClick, onClose }: LoadPresetDialogProps) => {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredRows, setFilteredRows] = useState(data)
  const rows = filteredRows.map((item) => (
    <LoadPresetDialogRow key={item.value} data={item} onLoadButtonClick={onLoadButtonClick} />
  ))
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
      className="height-fit preset-loader-dialog"
      centered
      size="lg"
      isOpen={visible}
      toggle={onClose}
      data-testid="PresetLoaderDialog"
    >
      <ModalHeader toggle={onClose}>{t('Change scenario')}</ModalHeader>
      <ModalBody>
        <InputGroup>
          <Input
            id="preset-loader-dialog-input"
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
              data-testid="PresetLoaderDialogClearButton"
              disabled={searchTerm === ''}
              onClick={() => {
                setSearchTerm('')
                executeFilter('')
              }}
            >
              {t('Clear')}
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <Table className="preset-loader-dialog-table">
          <thead>
            <tr>
              <th>
                {t('Showing')} {filteredRows.length} {t('of')} {data.length} {t('entries')}
              </th>
            </tr>
          </thead>
          <tbody className="preset-loader-dialog-table-body">{rows}</tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onClose} data-testid="PresetLoaderDialogCloseButton">
          {t('Done')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default LoadPresetDialog
