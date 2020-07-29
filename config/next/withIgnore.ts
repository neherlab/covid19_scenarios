import webpack from 'webpack'
import type { NextConfig } from 'next'

import { addWebpackPlugin } from './lib/addWebpackPlugin'

export default function withIgnore(nextConfig: NextConfig) {
  return addWebpackPlugin(
    nextConfig,
    new webpack.IgnorePlugin({
      checkResource: (resource: string) => {
        return (
          resource.endsWith('awesomplete.css') ||
          resource.includes('core-js/library') ||
          resource.includes('babel-runtime')
        )
      },
    }),
  )
}
