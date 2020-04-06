import React, { useCallback, useReducer } from 'react'
import { useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import path from 'path'
import './FileUploadZone.scss'

export enum FileType {
  CSV = 'CSV',
  TSV = 'TSV',
}

export interface FileUploadZoneProps {
  onFilesUploaded(files: Map<FileType, File>): void
  onFilesRejected?(): void
  accept?: string | string[]
  multiple?: boolean
  dropZoneMessage: string
  activeDropZoneMessage: string
}

/* Converts file extension to FileType enum */
function fileExtToType(ext: string) {
  const extMap = new Map<string, FileType>(
    Object.entries({
      '.csv': FileType.CSV,
      '.tsv': FileType.TSV,
    }),
  )
  return extMap.get(ext)
}

/* Adds relevant files to a Map to be dispatched */
function reduceDroppedFiles(files: Map<FileType, File>, file: File) {
  const ext = path.extname(file.name)
  const type = fileExtToType(ext)
  if (type) {
    files.set(type, file)
  }
  return files
}

function FileUploadZone(props: FileUploadZoneProps) {
  const [uploadedFiles, dispatchUploadedFile] = useReducer(reduceDroppedFiles, new Map())
  const onDrop = useCallback(
    (droppedFiles: File[]) => {
      droppedFiles.forEach(dispatchUploadedFile)
      props.onFilesUploaded(uploadedFiles)
    },
    [props.onFilesUploaded],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: props.accept,
    multiple: props.multiple,
    onDropAccepted: onDrop,
    onDropRejected: props.onFilesRejected,
  })
  const { t } = useTranslation()

  return (
    <div>
      <div {...getRootProps()} className="fileuploadzone-drop-area rounded p-3">
        <input type="file" {...getInputProps()} />
        <p className="h5 text-secondary text-center m-0">
          {isDragActive ? props.activeDropZoneMessage : props.dropZoneMessage}
        </p>
      </div>
      {uploadedFiles.size > 0 && (
        <>
          <h3 className="mt-4">{t('Your file', { count: uploadedFiles.size })}</h3>
          <ul>
            {[...uploadedFiles.values()].map(({ name, size }: File) => (
              <li key={name}>{t('{{fileName}} ({{fileSize}}Kb)', { fileName: name, fileSize: size / 1000 })}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default FileUploadZone
