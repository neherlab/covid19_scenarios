import type { NextConfig, NextWebpackOptions } from 'next'

import type { WebpackOptions, RuleSetRule } from 'webpack/declarations/WebpackOptions'

import { addWebpackConfig } from './addWebpackConfig'

export type GetLoaderFunction = (webpackConfig: WebpackOptions, options: NextWebpackOptions) => RuleSetRule

export function addWebpackLoader(nextConfig: NextConfig, getLoader: GetLoaderFunction) {
  return addWebpackConfig(nextConfig, (nextConfig, webpackConfig, options) => {
    const loader = getLoader(webpackConfig, options)
    webpackConfig?.module?.rules?.push(loader)
    return webpackConfig
  })
}
