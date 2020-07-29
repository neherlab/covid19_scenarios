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

export type WebpackFunction = (webpackConfig: WebpackOptions, options: NextWebpackOptions) => WebpackOptions

export type Target = 'server' | 'serverless' | 'experimental-serverless-trace'

export type ReactMode = 'legacy' | 'blocking' | 'concurrent'

export type SassOptions = object

export type ServerRuntimeConfig = object

export type PublicRuntimeConfig = object

export interface NextConfig {
  env?: object
  webpack?: WebpackFunction | null
  webpackDevMiddleware?: any
  distDir?: string
  assetPrefix?: string
  configOrigin?: string
  useFileSystemPublicRoutes?: boolean
  generateBuildId?: () => string
  generateEtags?: boolean
  pageExtensions?: string[]
  target?: Target
  poweredByHeader?: boolean
  compress?: boolean
  devIndicators?: {
    buildActivity?: boolean
    autoPrerender?: boolean
  }
  onDemandEntries?: {
    maxInactiveAge?: number
    pagesBufferLength?: number
  }
  amp?: {
    canonicalBase: string
  }
  exportTrailingSlash?: boolean
  sassOptions?: SassOptions
  experimental?: {
    cpus?: number
    modern?: boolean
    plugins?: boolean
    profiling?: boolean
    sprFlushToDisk?: boolean
    reactMode?: ReactMode
    workerThreads?: boolean
    basePath?: string
    pageEnv?: boolean
    productionBrowserSourceMaps?: boolean
    optionalCatchAll?: boolean
  }
  future?: {
    excludeDefaultMomentLocales?: boolean
  }
  serverRuntimeConfig?: ServerRuntimeConfig
  publicRuntimeConfig?: PublicRuntimeConfig
  reactStrictMode?: boolean
  typescript?: {
    ignoreDevErrors?: boolean
    ignoreBuildErrors?: boolean
  }
  exclude?: string | string[] | RegExp | RegExp[]
}
