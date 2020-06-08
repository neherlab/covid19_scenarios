import type { NextConfig } from 'next'

import { addWebpackLoader } from './lib/addWebpackLoader'

export default function withSvg(nextConfig: NextConfig) {
  return addWebpackLoader(nextConfig, (webpackConfig, { dev }) => ({
    // eslint-disable-next-line security/detect-unsafe-regex
    test: /\.svg(\?.*)?$/i,
    use: [
      {
        loader: '@svgr/webpack',
        options: {
          svgoConfig: {
            plugins: [
              {
                removeViewBox: false,
              },
            ],
          },
        },
      },
      {
        loader: 'url-loader',
        options: {
          limit: false,
          name: dev ? '[name].[ext]' : '[name].[hash:7].[ext]',
          publicPath: 'assets',
        },
      },
    ],
  }))
}
