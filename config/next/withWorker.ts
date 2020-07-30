import type { NextConfig } from 'next'
import WorkerPlugin from 'worker-plugin'

import { addWebpackPlugin } from './lib/addWebpackPlugin'

export default function withWorker(nextConfig: NextConfig) {
  return addWebpackPlugin(nextConfig, new WorkerPlugin({ globalObject: 'self' }))
}
