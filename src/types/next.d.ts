import { WebpackEntrypoints } from 'next/dist/build/entries'

export * from 'next/types/global'
export * from 'next/types/index'

export interface NextWebpackOptions {
  buildId: string
  config: any
  dev?: boolean
  isServer?: boolean
  pagesDir: string
  target?: string
  tracer?: any
  entrypoints: WebpackEntrypoints
}
