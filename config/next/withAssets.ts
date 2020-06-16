/* eslint-disable security/detect-unsafe-regex */
import type { NextConfig } from 'next'

import { addWebpackLoader } from './lib/addWebpackLoader'

export interface GetWithAssetsOptions {
  inlineImageLimit?: number
  assetPrefix?: string
}

const getWithAssets = ({ inlineImageLimit = 8192, assetPrefix = '' }: GetWithAssetsOptions = {}) => (
  nextConfig: NextConfig,
) => {
  return addWebpackLoader(nextConfig, (webpackConfig, { dev, isServer }) => ({
    test: /\.(eot|otf|webp|ttf|woff\d?|png|jpe?g|gif|ico)(\?.*)?$/i,
    issuer: {
      // Next.js already handles url() in css/sass/scss files
      test: /\.\w+(?<!(s?c|sa)ss)$/i,
    },
    loader: 'url-loader',
    options: {
      limit: inlineImageLimit,
      publicPath: `${nextConfig.assetPrefix}/_next/static/images/`,
      outputPath: `${isServer ? '../' : ''}static/images/`,
      name: dev ? '[name].[ext]' : '[name].[hash:7].[ext]',
      esModule: true,
    },
  }))
}

export default getWithAssets
