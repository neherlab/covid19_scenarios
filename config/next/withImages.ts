import type { NextConfig } from 'next'

import { addWebpackLoader } from './lib/addWebpackLoader'

export default function withSvg(nextConfig: NextConfig) {
  return addWebpackLoader(nextConfig, (webpackConfig, { dev, isServer }) => ({
    test: /\.(gif|ico|jp2|jpe?g|png|webp)$/,
    issuer: {
      // Next.js already handles url() in css/sass/scss files
      // eslint-disable-next-line security/detect-unsafe-regex
      test: /\.\w+(?<!(s?c|sa)ss)$/i,
    },
    exclude: nextConfig.exclude,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: false,
          name: dev ? '[name].[ext]' : '[name].[hash:7].[ext]',
          publicPath: `${nextConfig.assetPrefix}/_next/static/images/`,
          outputPath: `${isServer ? '../' : ''}static/images/`,
        },
      },
    ],
  }))
}
