import path from 'path'

export interface WebpackLoadAssetsParams {
  isDev: boolean
  inlineSmallerThan?: number
  subdirectory?: string
  publicPath?: string
}

export default function webpackLoadAssets({
  isDev,
  inlineSmallerThan,
  subdirectory = '',
  publicPath,
}: WebpackLoadAssetsParams) {
  const name = path.join(
    subdirectory,
    isDev ? '[name].[ext]' : '[name].[hash:7].[ext]',
  )

  return [
    {
      // eslint-disable-next-line security/detect-unsafe-regex
      test: /\.(eot|otf|webp|ttf|woff\d?|svg|png|jpe?g|gif)(\?.*)?$/i,
      loader: 'url-loader',
      options: {
        limit: inlineSmallerThan,
        name,
        publicPath,
      },
    },
  ]
}
