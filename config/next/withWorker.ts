import { WebpackOptions } from 'webpack/declarations/WebpackOptions'
import WorkerPlugin from 'worker-plugin'

import { NextWebpackOptions } from 'next'

export interface NextConfig {
  webpack?: (
    webpackConfig: WebpackOptions,
    options: NextWebpackOptions,
  ) => WebpackOptions
}

export type CustomWebpackConfig = (
  nextConfig: NextConfig,
  webpackConfig: WebpackOptions,
  options: NextWebpackOptions,
) => WebpackOptions

export function safeCustomWebpackConfig(
  nextConfig: NextConfig,
  customWebpackConfig: CustomWebpackConfig,
) {
  const webpack = (
    webpackConfig: WebpackOptions,
    options: NextWebpackOptions,
  ) => {
    const newConfig = customWebpackConfig(nextConfig, webpackConfig, options)

    if (typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(newConfig, options)
    }

    return newConfig
  }

  return { ...nextConfig, webpack }
}

export function safeAddWebpackPlugin(nextConfig: NextConfig, plugin: any) {
  return safeCustomWebpackConfig(
    nextConfig,
    (
      nextConfig: NextConfig,
      webpackConfig: WebpackOptions,
      { isServer }: NextWebpackOptions,
    ) => {
      if (!isServer) {
        if (webpackConfig?.plugins) {
          webpackConfig.plugins.push(plugin)
        } else {
          return { plugins: [plugin] }
        }
      }
      return webpackConfig
    },
  )
}

export function withWorker(nextConfig: NextConfig) {
  return safeAddWebpackPlugin(
    nextConfig,
    new WorkerPlugin({ globalObject: 'self' }),
  )
}
