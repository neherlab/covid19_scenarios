export default function withSvg(nextConfig = {}) {
  return {
    ...nextConfig,
    webpack(config, options) {
      const { dev } = options

      config.module.rules.push({
        // eslint-disable-next-line security/detect-unsafe-regex
        test: /\.svg(\?.*)?$/i,
        use: [
          {
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
            loader: 'url-loader',
            options: {
              limit: false,
              name: dev ? '[name].[ext]' : '[name].[hash:7].[ext]',
              publicPath: 'assets',
            },
          },
        ],
      })

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      return config
    },
  }
}
