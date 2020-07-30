import { NextConfig } from 'next'
import { addWebpackConfig } from './lib/addWebpackConfig'

const POLYFILLS_FILE = './src/polyfills.ts'

export default function withPolyfills(nextConfig: NextConfig) {
  return addWebpackConfig(nextConfig, (nextConfig, webpackConfig, options) => {
    const originalEntry = webpackConfig.entry

    webpackConfig.entry = async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const entries = await originalEntry()

      if (entries['main.js'] && !entries['main.js'].includes(POLYFILLS_FILE)) {
        entries['main.js'].unshift(POLYFILLS_FILE)
      }

      return entries
    }

    return webpackConfig
  })
}
