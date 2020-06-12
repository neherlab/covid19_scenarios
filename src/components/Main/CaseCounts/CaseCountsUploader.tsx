import React, { useState } from 'react'

import { FileRejection } from 'react-dropzone'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, UncontrolledAlert } from 'reactstrap'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import Papa from 'papaparse'

import { appendDash } from '../../../helpers/appendDash'

import type { CaseCountsDatum } from '../../../algorithms/types/Param.types'

import { FileReaderError, readFile } from '../../../helpers/readFile'
import { ErrorArray } from '../../../helpers/ErrorArray'

import { CSVParserErrorCSVSyntaxInvalid } from '../../../io/parsingCsv/errors'
import { convert, validate } from '../../../io/defaults/getCaseCountsData'

import CaseCountsUploaderInstructionsText from './CaseCountsUploaderInstructionsText.mdx'
import { CaseCountsLoaderUploadZone } from './CaseCountsUploadZone'

class UploadErrorTooManyFiles extends Error {
  public readonly nFiles: number
  constructor(nFiles: number) {
    super(`when uploading: one file is expected, but got ${nFiles}`)
    this.nFiles = nFiles
  }
}

class UploadErrorUnknown extends Error {
  constructor() {
    super(`when uploading: unknown error`)
  }
}

function exceptionsToStrings(error: Error): string[] {
  if (error instanceof UploadErrorTooManyFiles) {
    return [i18next.t('Only one file is expected')]
  }
  if (error instanceof UploadErrorUnknown) {
    return [i18next.t('Unknown error')]
  }
  if (error instanceof FileReaderError) {
    return [i18next.t('Unable to read file.')]
  }
  if (error instanceof ErrorArray) {
    return error.errors ?? []
  }

  throw error
}

export interface ImportedCaseCounts {
  fileName: string
  data: CaseCountsDatum[]
}

export interface ImportCaseCountDialogProps {
  onDataImported(data: ImportedCaseCounts): void
}

export default function CaseCountsUploader({ onDataImported }: ImportCaseCountDialogProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [errors, setErrors] = useState<string[]>([])

  const toggleOpen = () => setIsOpen(!isOpen)
  const close = () => setIsOpen(false)

  async function processFiles(acceptedFiles: File[], rejectedFiles: FileRejection[]) {
    const nFiles = acceptedFiles.length + rejectedFiles.length

    if (nFiles > 1) {
      throw new UploadErrorTooManyFiles(nFiles)
    }

    if (acceptedFiles.length !== 1) {
      throw new UploadErrorTooManyFiles(acceptedFiles.length)
    }

    const file = acceptedFiles[0]
    let content = ''
    try {
      content = await readFile(file)

      // NOTE: this should protect from parsing failures when file is using DOS-style newlines
      content = content.replace(/\r\n/g, '\n')
    } catch {
      throw new FileReaderError(file)
    }

    const { data, errors, meta } = Papa.parse(content, {
      header: true,
      skipEmptyLines: 'greedy',
      trimHeaders: true,
      dynamicTyping: true,
      comments: '#',
    })

    if (errors.length > 0) {
      throw new CSVParserErrorCSVSyntaxInvalid(errors.map((error) => error.message))
    } else if (meta.aborted || !data?.length) {
      throw new CSVParserErrorCSVSyntaxInvalid([`Aborted`])
    } else if (!data?.length) {
      throw new CSVParserErrorCSVSyntaxInvalid([`There was no data`])
    }

    const dataDangerous = { data, name: file.name }
    validate(dataDangerous)
    const converted = convert(dataDangerous)
    onDataImported({ fileName: file.name, data: converted.data })
    close()
  }

  async function onDrop(acceptedFiles: File[], rejectedFiles: FileRejection[]) {
    setErrors([])

    try {
      await processFiles(acceptedFiles, rejectedFiles)
    } catch (error) {
      const errors = exceptionsToStrings(error)
      setErrors((prevErrors) => [...prevErrors, ...errors])
    }
  }

  const hasErrors = errors.length > 0
  if (hasErrors) {
    console.warn(`Errors when uploading:\n${errors.map(appendDash).join('\n')}`)
  }

  return (
    <>
      <div className="text-right pb-2">
        <Button size="sm" color="link" onClick={toggleOpen} className="pt-0">
          {t('or import your own data')}
        </Button>
      </div>

      <Modal className="height-fit" centered size="lg" fade={false} isOpen={isOpen} toggle={toggleOpen}>
        <ModalHeader toggle={toggleOpen}>{t('Import more data')}</ModalHeader>
        <ModalBody>
          <div className="case-counts-uploader-container">
            <CaseCountsUploaderInstructionsText />
            <CaseCountsLoaderUploadZone onDrop={onDrop} />

            <div className="mt-3 case-counts-uploader-error-list">
              {hasErrors && (
                <>
                  <h4 className="mt-2 text-danger">{t(`Error`)}</h4>
                  {errors.map((error) => (
                    <UncontrolledAlert color="danger" className="case-counts-uploader-error-list-item" key={error}>
                      {error}
                    </UncontrolledAlert>
                  ))}
                </>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleOpen}>
            {t('Cancel')}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
