import PacktrackerPlugin from '@packtracker/webpack-plugin'
import type { NextConfig } from 'next'
import { addWebpackPlugin } from './lib/addWebpackPlugin'
import { getenv } from '../../lib/getenv'

export default function withPacktracker(nextConfig: NextConfig) {
  const PT_PROJECT_TOKEN = getenv('PT_PROJECT_TOKEN', null)
  if (!PT_PROJECT_TOKEN) {
    return nextConfig
  }

  return addWebpackPlugin(
    nextConfig,
    new PacktrackerPlugin({
      project_token: PT_PROJECT_TOKEN,
      upload: true,
      fail_build: true,
    }),
  )
}
