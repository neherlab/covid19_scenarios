import type { NextConfig } from 'next'
import ExtraWatchWebpackPlugin from 'extra-watch-webpack-plugin'

import { addWebpackPlugin } from './lib/addWebpackPlugin'

export interface WithExtraWatchOptions {
  files: string[]
  dirs: string[]
}

const getWithExtraWatch = ({ files, dirs }: WithExtraWatchOptions) => (nextConfig: NextConfig) => {
  return addWebpackPlugin(nextConfig, new ExtraWatchWebpackPlugin({ files, dirs }))
}

export default getWithExtraWatch
