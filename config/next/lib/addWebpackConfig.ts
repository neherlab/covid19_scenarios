import type { NextWebpackOptions, NextConfig } from 'next'
import type { WebpackOptions } from 'webpack/declarations/WebpackOptions'

import { CustomWebpackConfig } from './CustomWebpackConfig'

export function addWebpackConfig(nextConfig: NextConfig, customWebpackConfig: CustomWebpackConfig) {
  const webpack = (webpackConfig: WebpackOptions, options: NextWebpackOptions) => {
    const newConfig = customWebpackConfig(nextConfig, webpackConfig, options)

    if (typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(newConfig, options)
    }

    return newConfig
  }

  return { ...nextConfig, webpack }
}
