import React, { useState } from 'react'

import ErrorBoundary from 'react-error-boundary'
import { useTranslation } from 'react-i18next'
import { Col, Row, Container, Card } from 'reactstrap'
import type { AnyAction } from 'typescript-fsa'

import type { SeverityDistributionDatum } from '../../../algorithms/types/Param.types'
import { appendDash } from '../../../helpers/appendDash'

import { readFile, FileReaderError } from '../../../helpers/readFile'

import { setStateData } from '../state/actions'
import { deserialize, DeserializationError } from '../state/serialize'

import { ScenarioLoaderUploadZone } from './ScenarioLoaderUploadZone'

class UploadErrorTooManyFiles extends Error {
  public readonly nFiles?: number
  constructor(nFiles?: number) {
    super(`when uploading: one file is expected, but got ${nFiles}`)
    this.nFiles = nFiles
  }
}

class UploadErrorUnknown extends Error {
  constructor() {
    super(`when uploading: unknown error`)
  }
}

class UploadErrorDeserializationFailed extends Error {
  public readonly errors?: string[]
  constructor(errors?: string[]) {
    super(`when uploading: file validation failed:\n${errors?.map(appendDash)?.join('\n')}`)
    this.errors = errors
  }
}

export interface ScenarioLoaderUploaderProps {
  close(): void
  setSeverity(severity: SeverityDistributionDatum[]): void
  scenarioDispatch(action: AnyAction): void
}

export function ScenarioLoaderUploader({ scenarioDispatch, setSeverity, close }: ScenarioLoaderUploaderProps) {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<string[]>([])

  const hasErrors = errors.length > 0

  if (hasErrors) {
    console.warn(`Errors when uploading:\n${errors.map(appendDash).join('\n')}`)
  }

  function handleError(error: Error) {
    if (error instanceof UploadErrorTooManyFiles) {
      setErrors((prevErrors) => [...prevErrors, t('Only one file is expected')])
    } else if (error instanceof UploadErrorUnknown) {
      setErrors((prevErrors) => [...prevErrors, t('Unknown error')])
    } else if (error instanceof FileReaderError) {
      setErrors((prevErrors) => [...prevErrors, t('Unable to read file.')])
    } else if (error instanceof DeserializationError) {
      const errors = error?.errors
      if (errors && errors.length > 0) {
        setErrors((prevErrors) => [...prevErrors, ...errors])
      }
    } else {
      throw error
    }
  }

  async function processFiles(acceptedFiles: File[], rejectedFiles: File[]) {
    const nFiles = acceptedFiles.length + rejectedFiles.length

    if (nFiles > 1) {
      throw new UploadErrorTooManyFiles(nFiles)
    }

    if (acceptedFiles.length !== 1) {
      throw new UploadErrorTooManyFiles(acceptedFiles.length)
    }

    const str = await readFile(acceptedFiles[0])
    const params = deserialize(str)

    if (!params) {
      throw new UploadErrorUnknown()
    }

    scenarioDispatch(
      setStateData({
        current: params.scenarioName,
        data: params.scenario,
        ageDistribution: params.ageDistribution,
      }),
    )

    setSeverity(params.severity)

    close()
  }

  async function onDrop(acceptedFiles: File[], rejectedFiles: File[]) {
    setErrors([])

    try {
      await processFiles(acceptedFiles, rejectedFiles)
    } catch (error) {
      handleError(error)
      return
    }

    setErrors([])
  }

  return (
    <Container>
      <Row noGutters>
        <Col>
          <ScenarioLoaderUploadZone onDrop={onDrop} />
        </Col>
      </Row>

      <Row noGutters>
        <Col>
          {errors.map((error) => (
            <div key={error}>{error}</div>
          ))}
        </Col>
      </Row>
    </Container>
  )
}
