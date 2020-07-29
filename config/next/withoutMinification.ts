import { NextConfig } from 'next'
import { addWebpackConfig } from './lib/addWebpackConfig'

export default function withoutMinification(nextConfig: NextConfig) {
  return addWebpackConfig(nextConfig, (nextConfig, webpackConfig, options) => {
    if (webpackConfig.optimization) {
      webpackConfig.optimization.minimizer = []
    } else {
      webpackConfig.optimization = { minimizer: [] }
    }
    return webpackConfig
  })
}
