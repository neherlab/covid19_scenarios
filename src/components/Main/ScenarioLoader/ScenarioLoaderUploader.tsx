import React, { useState } from 'react'

import { FileRejection } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { UncontrolledAlert } from 'reactstrap'
import type { ActionCreator } from 'src/state/util/fsaActions'
import { ScenarioParameters } from '../../../algorithms/types/Param.types'

import { appendDash } from '../../../helpers/appendDash'

import { deserialize } from '../../../io/serialization/deserialize'
import { DeserializationError } from '../../../io/serialization/errors'
import { readFile, FileReaderError } from '../../../helpers/readFile'
import { setScenarioState } from '../../../state/scenario/scenario.actions'

import { ScenarioLoaderUploadZone } from './ScenarioLoaderUploadZone'
import ScenarioLoaderUploadInstructionsText from './ScenarioLoaderUploadInstructionsText.mdx'

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

export interface ScenarioLoaderUploaderProps {
  close(): void
  setScenarioState: ActionCreator<ScenarioParameters>
}

const mapStateToProps = undefined

const mapDispatchToProps = {
  setScenarioState,
}

export const ScenarioLoaderUploader = connect(mapStateToProps, mapDispatchToProps)(ScenarioLoaderUploaderDisconnected)

export function ScenarioLoaderUploaderDisconnected({ setScenarioState, close }: ScenarioLoaderUploaderProps) {
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
      const { errors } = error
      if (errors && errors.length > 0) {
        setErrors((prevErrors) => [...prevErrors, ...errors])
      }
    } else {
      throw error
    }
  }

  async function processFiles(acceptedFiles: File[], rejectedFiles: FileRejection[]) {
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

    setScenarioState(params)
    close()
  }

  async function onDrop(acceptedFiles: File[], rejectedFiles: FileRejection[]) {
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
    <div className="scenario-loader-uploader-container">
      <div className="">
        <ScenarioLoaderUploadInstructionsText />
        <ScenarioLoaderUploadZone onDrop={onDrop} />
      </div>

      <div className="mt-3 scenario-loader-uploader-error-list">
        {hasErrors && (
          <>
            <h4 className="mt-2 text-danger">{t(`Error`)}</h4>
            {errors.map((error) => (
              <UncontrolledAlert color="danger" className="scenario-loader-uploader-error-list-item" key={error}>
                {error}
              </UncontrolledAlert>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
