import type { NextWebpackOptions, NextConfig } from 'next'
import type { WebpackOptions, WebpackPluginFunction, WebpackPluginInstance } from 'webpack/declarations/WebpackOptions'

import { addWebpackConfig } from './addWebpackConfig'

export function addWebpackPlugin(nextConfig: NextConfig, plugin: WebpackPluginInstance | WebpackPluginFunction) {
  return addWebpackConfig(
    nextConfig,
    (nextConfig: NextConfig, webpackConfig: WebpackOptions, { isServer }: NextWebpackOptions) => {
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
