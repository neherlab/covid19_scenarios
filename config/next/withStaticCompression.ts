import CompressionPlugin from 'compression-webpack-plugin'

import zlib from 'zlib'
import { NextConfig } from 'next'
import { addWebpackPlugin } from './lib/addWebpackPlugin'

function nodeHasBrotli() {
  return !!zlib.brotliCompress
}

export interface CompressionAlgorithmParams {
  level?: number
  threshold?: number
  minRatio?: number
}

export interface WebpackCompressionParams {
  gzip?: CompressionAlgorithmParams | false
  brotli?: CompressionAlgorithmParams | false
  cache?: boolean
  exclude?: ReadonlyArray<RegExp>
}

const getWithStaticCompression = ({
  gzip = { level: 6, threshold: 0, minRatio: Infinity },
  brotli = { level: 6, threshold: 0, minRatio: Infinity },
  cache = false,
  exclude = [],
}: WebpackCompressionParams = {}) => (nextConfig: NextConfig) => {
  if (brotli && !nodeHasBrotli()) {
    throw new Error(
      `Brotli compression is enabled, but current version of Node.js
      (${process.version}) does not support 'brotliCompress'.
      Node.js >= 11.7 is required.`,
    )
  }

  if (gzip) {
    const gzipPlugin = new CompressionPlugin({
      filename: '[path].gz[query]',
      exclude: [/\.(gz|br)$/, ...exclude],
      algorithm: 'gzip',
      compressionOptions: {
        level: gzip.level,
      },
      cache,
      threshold: gzip.threshold,
      minRatio: gzip.minRatio,
    })

    // eslint-disable-next-line no-param-reassign
    nextConfig = addWebpackPlugin(nextConfig, gzipPlugin)
  }

  if (brotli) {
    const brotliPlugin = new CompressionPlugin({
      filename: '[path].br[query]',
      exclude: [/\.(gz|br)$/, ...exclude],
      algorithm: 'brotliCompress',
      compressionOptions: {
        level: brotli.level,
      },
      cache: true,
      threshold: brotli.threshold,
      minRatio: brotli.minRatio,
    })

    // eslint-disable-next-line no-param-reassign
    nextConfig = addWebpackPlugin(nextConfig, brotliPlugin)
  }

  return nextConfig
}

export default getWithStaticCompression
