import React from 'react'

import { DropEvent, useDropzone } from 'react-dropzone'

import { useTranslation } from 'react-i18next'

export interface FileUploadZoneProps {
  onDrop<T extends File>(acceptedFiles: T[], rejectedFiles: T[], event: DropEvent): void
}

function FileUploadZone({ onDrop }: FileUploadZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false })
  const { t } = useTranslation()
  return (
    <div>
      <div {...getRootProps()}>
        <input type="file" {...getInputProps()} />
        {isDragActive ? (
          <p>{t('Drop the files here ...')}</p>
        ) : (
          <p>{t("Drag n' drop some files here, or click to select files")}</p>
        )}
      </div>
    </div>
  )
}

export default FileUploadZone
