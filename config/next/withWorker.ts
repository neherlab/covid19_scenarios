import type { NextConfig } from 'next'
import WorkerPlugin from 'worker-plugin'

import { addWebpackPlugin } from './lib/addWebpackPlugin'

export function withWorker(nextConfig: NextConfig) {
  return addWebpackPlugin(nextConfig, new WorkerPlugin({ globalObject: 'self' }))
}
