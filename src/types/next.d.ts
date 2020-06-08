import { WebpackEntrypoints } from 'next/dist/build/entries'
import { WebpackOptions } from 'webpack/declarations/WebpackOptions'

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

export interface NextConfig {
  webpack?: (webpackConfig: WebpackOptions, options: NextWebpackOptions) => WebpackOptions
}
