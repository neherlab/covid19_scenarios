import type { NextConfig } from 'next'
import LodashWebpackPlugin, { Options } from 'lodash-webpack-plugin'

import { addWebpackPlugin } from './lib/addWebpackPlugin'

const withLodash = (options: Options) => (nextConfig: NextConfig) => {
  return addWebpackPlugin(nextConfig, new LodashWebpackPlugin(options))
}

export default withLodash
