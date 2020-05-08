import React, { useCallback, useReducer, Reducer } from 'react'
import { useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import './FileUploadZone.scss'

export enum FileType {
  CSV = 'CSV',
  TSV = 'TSV',
}

export interface FileUploadZoneProps {
  onFilesUploaded(files: File[]): void
  onFilesRejected?(): void
  accept?: string | string[]
  multiple?: boolean
  dropZoneMessage: string
  activeDropZoneMessage: string
}

/* Adds relevant files to a Map to be dispatched */
function reduceDroppedFiles(files: File[], file: File) {
  files.push(file)
  return files
}

function FileUploadZone({
  accept,
  multiple,
  onFilesUploaded,
  onFilesRejected,
  dropZoneMessage,
  activeDropZoneMessage,
}: FileUploadZoneProps) {
  const [uploadedFiles, dispatchUploadedFile] = useReducer<Reducer<File[], File>>(reduceDroppedFiles, [])
  const onDrop = useCallback(
    (droppedFiles: File[]) => {
      droppedFiles.forEach(dispatchUploadedFile)
      onFilesUploaded(uploadedFiles)
    },
    [onFilesUploaded, uploadedFiles],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    multiple,
    onDropAccepted: onDrop,
    onDropRejected: onFilesRejected,
  })
  const { t } = useTranslation()

  return (
    <div>
      <div {...getRootProps()} className="fileuploadzone-drop-area rounded p-3">
        <input type="file" {...getInputProps()} />
        <p className="h5 text-secondary text-center m-0">{isDragActive ? activeDropZoneMessage : dropZoneMessage}</p>
      </div>
      {uploadedFiles.length > 0 && (
        <>
          <h3 className="mt-4">{t('Your file', { count: uploadedFiles.length })}</h3>
          <ul>
            {uploadedFiles.map((file: File) => (
              <li key={file.name}>
                {t('{{fileName}} ({{fileSize}}Kb)', { fileName: file.name, fileSize: file.size / 1000 })}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default FileUploadZone
