import * as React from 'react';

interface Options {
  debug?: boolean
  format?: 'text/html' | 'text/plain'
  message?: string
}

export interface CopyToClipboardProps {
  children: React.ReactNode
  text: string
  onCopy?: (text: string, result: boolean) => void
  options?: Options
}

declare class CopyToClipboard extends React.Component<CopyToClipboardProps> 
export CopyToClipboard
