import path from 'path'

import React, { useCallback } from 'react'

import { useDropzone } from 'react-dropzone'

/* Adds relevant files to a Map to be dispatched */
function reduceDroppedFiles(files: Map<FileType, File>, file: File) {
  const ext = path.extname(file.name)
  const type = fileExtToType(ext)
  if (type) {
    files.set(type, file)
  }
  return files
}

export enum FileType {
  CSV = 'CSV',
}

/* Converts file extension to FileType enum */
function fileExtToType(ext: string) {
  const extMap = new Map<string, FileType>(Object.entries({ '.csv': FileType.CSV }))
  return extMap.get(ext)
}

export interface FileUploadZoneProps {
  files: Map<FileType, File>
  onFilesChange(files: Map<FileType, File>): void
}

function FileUploadZone({ files, onFilesChange }: FileUploadZoneProps) {
  const onDrop = useCallback(
    (droppedFiles: File[]) => {
      const files = droppedFiles.reduce(reduceDroppedFiles, new Map())
      onFilesChange(files)
    },
    [onFilesChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div>
      <div {...getRootProps()}>
        <input type="file" {...getInputProps()} />
        {isDragActive ? (
          <p>{'Drop the files here ...'}</p>
        ) : (
          <p>{`Drag 'n' drop some files here, or click to select files`}</p>
        )}
        <ul>
          {[...files.values()].map(({ name }: File) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default FileUploadZone
