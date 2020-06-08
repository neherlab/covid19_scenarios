import { isEmpty } from 'lodash'
import Webpack from 'webpack'
import WorkerPlugin from 'worker-plugin'

import nextRuntimeDotenv from 'next-runtime-dotenv'
import withBundleAnalyzer from '@zeit/next-bundle-analyzer'
import getWithMDX from '@next/mdx'
import withPlugins from 'next-compose-plugins'

import { withWorker } from './config/next/withWorker'

import { getenv } from './lib/getenv'
import { findModuleRoot } from './lib/findModuleRoot'

const withMDX = getWithMDX({ extension: /\.mdx?$/ })

const MODE = getenv('NODE_ENV') === 'development' ? 'development' : 'production' // prettier-ignore
const production = MODE === 'production'
const development = MODE === 'development'
const analyze = getenv('ANALYZE', '0') === '1'
const profile = getenv('PROFILE', '0') === '1'
const debuggableProd = getenv('DEBUGGABLE_PROD', '0') === '1'
const sourceMaps = true
const schema = getenv('WEB_SCHEMA')
const host = getenv('WEB_HOST', getenv('NOW_URL', 'null'))
const portDev = getenv('WEB_PORT_DEV')
const portProd = getenv('WEB_PORT_PROD')
const portAnalyze = Number.parseInt(getenv('WEB_ANALYZER_PORT', '8888'), 10) // prettier-ignore
const fancyConsole = getenv('DEV_FANCY_CONSOLE', '0') === '1'
const fancyClearConsole = getenv('DEV_FANCY_CLEAR_CONSOLE', '0') === '1'
const disableChecks = getenv('DEV_DISABLE_CHECKS') === '1'
const disableStylelint = disableChecks || getenv('DEV_DISABLE_STYLELINT') === '1'

const { pkg, moduleRoot } = findModuleRoot()

function getWebRoot() {
  let root = `${schema}://${host}`

  if (development && !isEmpty(portDev)) {
    root = `${root}:${portDev}`
  }

  if (production && !isEmpty(portProd) && portProd !== 'null') {
    root = `${root}:${portProd}`
  }

  return root
}

function withEnvironment(nextConfig = {}) {
  return {
    ...nextConfig,
    webpack(config, options) {
      config.plugins.push(
        new Webpack.EnvironmentPlugin({
          BABEL_ENV: process.env.BABEL_ENV,
          DEBUGGABLE_PROD: process.env.DEBUGGABLE_PROD,
          NODE_ENV: process.env.NODE_ENV,
          DEV_ENABLE_I18N_DEBUG: getenv('DEV_ENABLE_I18N_DEBUG', '0'),
          DEV_ENABLE_REDUX_IMMUTABLE_STATE_INVARIANT: getenv('DEV_ENABLE_REDUX_IMMUTABLE_STATE_INVARIANT', '0'), // prettier-ignore
          IS_PRODUCTION: production,
          IS_DEVELOPMENT: development,
          ENV_NAME:
            getenv('TRAVIS_BRANCH', null) ??
            getenv('NOW_GITHUB_COMMIT_REF', null) ??
            getenv('VERCEL_GITHUB_COMMIT_REF', null) ??
            require('child_process').execSync('git rev-parse --abbrev-ref HEAD').toString().trim(),
          PACKAGE_VERSION: pkg.version,
          BUILD_NUMBER: getenv('TRAVIS_BUILD_NUMBER', null),
          TRAVIS_BUILD_WEB_URL: getenv('TRAVIS_BUILD_WEB_URL', null),
          REVISION:
            getenv('TRAVIS_COMMIT', null) ??
            getenv('NOW_GITHUB_COMMIT_SHA', null) ??
            getenv('VERCEL_GITHUB_COMMIT_SHA', null) ??
            require('child_process').execSync('git rev-parse HEAD').toString().trim(),
          WEB_ROOT: getWebRoot(),
        }),
      )

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      return config
    },
  }
}

function withSvg(nextConfig = {}) {
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

function withFriendlyConsole() {}

const nextConfig = {
  distDir: `.build/${process.env.NODE_ENV}/web`,
  experimental: {
    modern: true,
    productionBrowserSourceMaps: true,
  },
  future: {
    excludeDefaultMomentLocales: true,
  },
  devIndicators: {
    buildActivity: true,
    autoPrerender: true,
  },
}

const withConfig = nextRuntimeDotenv()

module.exports = withConfig(
  withPlugins(
    [
      [withEnvironment],
      [withWorker],
      [withSvg],
      [withBundleAnalyzer],
      [withMDX, { pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'] }],
    ],
    nextConfig,
  ),
)
