import CompressionPlugin from 'compression-webpack-plugin'

import zlib from 'zlib'

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

export default function webpackCompression({
  gzip = { level: 6, threshold: 0, minRatio: Infinity },
  brotli = { level: 6, threshold: 0, minRatio: Infinity },
  cache = false,
  exclude = [],
}: WebpackCompressionParams) {
  if (brotli && !nodeHasBrotli()) {
    throw new Error(
      `Brotli compression is enabled, but current version of Node.js
      (${process.version}) does not support 'brotliCompress'.
      Node.js >= 11.7 is required.`,
    )
  }

  return [
    gzip &&
      new CompressionPlugin({
        filename: '[path].gz[query]',
        exclude: [/\.(gz|br)$/, ...exclude],
        algorithm: 'gzip',
        compressionOptions: {
          level: gzip.level,
        },
        cache,
        threshold: gzip.threshold,
        minRatio: gzip.minRatio,
      }),

    brotli &&
      new CompressionPlugin({
        filename: '[path].br[query]',
        exclude: [/\.(gz|br)$/, ...exclude],
        algorithm: 'brotliCompress',
        compressionOptions: {
          level: brotli.level,
        },
        cache: true,
        threshold: brotli.threshold,
        minRatio: brotli.minRatio,
      }),
  ]
}
