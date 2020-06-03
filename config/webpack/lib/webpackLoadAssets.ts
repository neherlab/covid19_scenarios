/* eslint-disable security/detect-unsafe-regex */
import urljoin from 'url-join'

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
  const filename = isDev ? '[name].[ext]' : '[name].[hash:7].[ext]'
  let name = filename
  if (subdirectory?.length > 0) {
    name = urljoin(subdirectory, name)
  }

  return [
    {
      test: /\.svg(\?.*)?$/i,
      // issuer: { test: /\.[jt]sx?$/ },
      loader: '@svgr/webpack',
      options: {
        svgoConfig: {
          plugins: [
            {
              removeViewBox: false,
            },
          ],
        },
      },
    },
    {
      test: /\.(eot|otf|webp|ttf|woff\d?|png|jpe?g|gif)(\?.*)?$/i,
      loader: 'url-loader',
      options: {
        limit: inlineSmallerThan,
        name,
        publicPath,
      },
    },
  ]
}
