import { saveAs } from 'file-saver'

export class ExportErrorBlobApiNotSupported extends Error {
  constructor() {
    super('Error: when exporting: `Blob()` API is not supported by this browser')
  }
}

export function checkBlobSupport() {
  try {
    return !!new Blob()
  } catch {
    throw new ExportErrorBlobApiNotSupported()
  }
}

export interface SaveFileOptions {
  mimeType?: string
}

export function saveTextFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type })
  saveBlobFile(blob, filename)
}

export function saveBlobFile(content: Blob, filename: string) {
  saveAs(content, filename)
}
