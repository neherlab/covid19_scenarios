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
  onFilesChange(files: Map<FileType, File>): void
}


/* Converts file extension to FileType enum */
function fileExtToType(ext: string) {
  const extMap = new Map<string, FileType>(Object.entries({
    '.csv': FileType.CSV,
    '.tsv': FileType.TSV,
  }))
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


function FileUploadZone({ onFilesChange }: FileUploadZoneProps) {
  const [uploadedFiles, dispatchUploadedFile] = useReducer(reduceDroppedFiles, new Map())
  const onDrop = useCallback(
    (droppedFiles: File[]) => {
      droppedFiles.forEach(dispatchUploadedFile);
      onFilesChange(uploadedFiles)
    },
    [onFilesChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
  const { t } = useTranslation()
  return (
    <div>
      <div {...getRootProps()} className="fileuploadzone-drop-area rounded p-3">
        <input type="file" {...getInputProps()} />
        {isDragActive ? (
          <p>{t('Drop the files here ...')}</p>
        ) : (
          <p>{t("Drag n' drop some files here, or click to select files")}</p>
        )}
      </div>
      <ul>
        {uploadedFiles.size > 0 && [...uploadedFiles.values()].map(({ name }: File) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  )
}

export default FileUploadZone
