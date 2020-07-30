import { NextConfig, NextWebpackOptions } from 'next'
import { WebpackOptions } from 'webpack/declarations/WebpackOptions'

export type CustomWebpackConfig = (
  nextConfig: NextConfig,
  webpackConfig: WebpackOptions,
  options: NextWebpackOptions,
) => WebpackOptions
