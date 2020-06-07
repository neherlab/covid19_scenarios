import '../dotenv'

import _ from 'lodash'

import path from 'path'

// import glob from 'glob-all'

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import express from 'express'
import ExtraWatchWebpackPlugin from 'extra-watch-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import LodashWebpackPlugin from 'lodash-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import PreloadWebpackPlugin from 'preload-webpack-plugin'
// import PurgecssPlugin from 'purgecss-webpack-plugin'
import SizePlugin from 'size-plugin'
import kill from 'tree-kill'
import webpack from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import isInteractive from 'is-interactive'

import WorkerPlugin from 'worker-plugin'

import webpackCompression from './lib/webpackCompression'
import webpackFriendlyConsole from './lib/webpackFriendlyConsole'
import webpackLoadAssets from './lib/webpackLoadAssets'
import webpackLoadJavascript from './lib/webpackLoadJavascript'
import webpackLoadStyles from './lib/webpackLoadStyles'
import webpackStylelint from './lib/webpackStylelint'
import webpackTerser from './lib/webpackTerser'
import webpackTsChecker from './lib/webpackTsChecker'

import { findModuleRoot } from '../../lib/findModuleRoot'
import { getenv } from '../../lib/getenv'
// import htmlTags from './lib/htmlTags'

import babelConfig from 'babel.config.js'

process.once('SIGINT', () => {
  kill(process.pid, 'SIGTERM')
  process.exit(0)
})

process.once('SIGTERM', () => {
  kill(process.pid, 'SIGTERM')
  process.exit(0)
})

const MODE: 'development' | 'production' = getenv('NODE_ENV') === 'development' ? 'development' : 'production' // prettier-ignore

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
const disableStylelint =
  disableChecks || getenv('DEV_DISABLE_STYLELINT') === '1'

function getWebRoot() {
  let root = `${schema}://${host}`

  if (development && !_.isEmpty(portDev)) {
    root = `${root}:${portDev}`
  }

  if (production && !_.isEmpty(portProd) && portProd !== 'null') {
    root = `${root}:${portProd}`
  }

  return root
}

const { moduleRoot, pkg } = findModuleRoot()
const buildPath = path.join(moduleRoot, '.build', analyze ? 'analyze' : MODE, 'web') // prettier-ignore

function alias(development: boolean) {
  let productionAliases: Record<string, string> = {
    jsonp$: path.join(moduleRoot, '3rdparty/__empty-module'),
  }

  if (profile) {
    productionAliases = {
      ...productionAliases,
      'react-dom$': 'react-dom/profiling',
      'scheduler/tracing': 'scheduler/tracing-profiling',
    }
  }

  if (development) {
    productionAliases = {
      ...productionAliases,
    }
  }

  return productionAliases
}

function outputFilename(development: boolean, ext = 'js') {
  if (development || analyze) {
    return `content/[name].${ext}`
  }

  if (debuggableProd) {
    return `content/[name].[chunkhash:8].${ext}`
  }

  return `content/[chunkhash:8].${ext}`
}

export default {
  mode: MODE,
  bail: true,
  name: pkg.name,
  target: 'web',
  devtool: false,
  stats: fancyConsole
    ? false
    : {
        all: false,
        errors: true,
        warnings: true,
        moduleTrace: true,
        colors: true,
      },
  performance: {
    hints: false,
  },

  entry: path.join(moduleRoot, `src/index.polyfilled.ts`),

  output: {
    globalObject: 'self',
    path: buildPath,
    filename: outputFilename(development),
    chunkFilename: outputFilename(development),
    publicPath: '/',
    hashDigest: 'hex',
    hashDigestLength: 16,
    hashFunction: 'sha256',
    pathinfo: false,
  },

  devServer: {
    contentBase: path.join(buildPath, '..'),
    before: (app: express.Application) => {
      app.use(express.static(path.join(buildPath, 'sourcemaps')))
      app.use(express.static(path.join(moduleRoot, 'static')))
    },
    compress: true,
    disableHostCheck: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
    lazy: false,
    overlay: {
      warnings: false,
      errors: true,
    },
    port: portDev,
    publicPath: '/',
    quiet: false,
    logLevel: 'info',
    clientLogLevel: 'error',
    writeToDisk: true,
  },

  module: {
    rules: [
      ...webpackLoadJavascript({
        babelConfig,
        options: { caller: { target: 'web' } },
        sourceMaps,
        transpiledLibs: production && [
          '@loadable',
          '@redux-saga',
          'create-color',
          'd3-array',
          'delay',
          'immer',
          'lodash',
          'p-min-delay',
          'proper-url-join',
          'query-string',
          'react-router',
          'react-share',
          'recharts',
          'redux/es',
          'semver',
          'split-on-first',
          'strict-uri-encode',
        ],
        nonTranspiledLibs: production && ['d3-array/src/cumsum.js'],
      }),

      ...webpackLoadStyles({
        isDev: development,
        isServer: false,
        sourceMap: sourceMaps,
      }),

      ...webpackLoadAssets({
        isDev: development,
        inlineSmallerThan: 0,
        subdirectory: 'assets',
      }),
    ],
  },

  resolve: {
    symlinks: false,

    mainFields: [
      'ts:main',
      'ts:module',
      'tsmain',
      'tsmodule',
      'module',
      'jsnext:main',
      'esmodule',
      'es:module',
      'esm',
      'es2015',
      'main',
      'source',
    ],
    extensions: [
      '.wasm',
      '.ts',
      '.tsx',
      '.es.js',
      '.mjs',
      '.web.js',
      '.web.jsx',
      '.js',
      '.jsx',
      '.md',
      '.mdx',
    ],

    alias: alias(development),
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: path.join(buildPath, 'index.html'),
      inject: true,
      template: path.join(moduleRoot, 'src', 'index.ejs'),
      vars: {
        title: getenv('WEB_APP_NAME_FRIENDLY'),
        webRoot: getWebRoot(),
      },
    }),

    new PreloadWebpackPlugin({
      rel: 'preload',
      include: ['main', 'pages/Home'],
      fileBlacklist: [/\.map/, /\.hot-update\./],
    }),

    !analyze &&
      new ExtraWatchWebpackPlugin({
        files: ['src/types/**/*.d.ts'],
        dirs: [],
      }),

    !disableStylelint && !analyze && webpackStylelint(),

    !disableChecks &&
      !analyze &&
      webpackTsChecker({
        warningsAreErrors: production,
        memoryLimit: 2048,
        tsconfig: path.join(moduleRoot, 'tsconfig.json'),
        reportFiles: [
          'src/**/*.{js,jsx,ts,tsx}',

          // FIXME: errors in these files have to be resolved eventually
          // begin
          '!src/algorithms/model.ts', // FIXME
          '!src/algorithms/results.ts', // FIXME
          '!src/components/Main/Results/AgeBarChart.tsx', // FIXME
          '!src/components/Main/Results/DeterministicLinePlot.tsx', // FIXME
          // end

          '!src/**/*.(spec|test).{js,jsx,ts,tsx}',
          '!src/**/__tests__/**/*.{js,jsx,ts,tsx}',
          '!src/*generated*/**/*',
          '!src/algorithms/__test_data__/**/*',
          '!src/styles/**/*',
          '!static/**/*',
        ],
      }),

    ...(fancyConsole && isInteractive()
      ? webpackFriendlyConsole({
          clearConsole: !analyze && fancyClearConsole,
          projectRoot: path.resolve(moduleRoot),
          packageName: pkg.name || 'web',
          progressBarColor: 'red',
        })
      : []),

    new webpack.EnvironmentPlugin({
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
        require('child_process')
          .execSync('git rev-parse --abbrev-ref HEAD')
          .toString()
          .trim(),
      PACKAGE_VERSION: pkg.version,
      BUILD_NUMBER: getenv('TRAVIS_BUILD_NUMBER', null),
      TRAVIS_BUILD_WEB_URL: getenv('TRAVIS_BUILD_WEB_URL', null),
      REVISION:
        getenv('TRAVIS_COMMIT', null) ??
        getenv('NOW_GITHUB_COMMIT_SHA', null) ??
        getenv('VERCEL_GITHUB_COMMIT_SHA', null) ??
        require('child_process')
          .execSync('git rev-parse HEAD')
          .toString()
          .trim(),
      WEB_ROOT: getWebRoot(),
    }),

    new MiniCssExtractPlugin({
      filename: outputFilename(development, 'css'),
      chunkFilename: outputFilename(development, 'css'),
    }),

    development && new ReactRefreshWebpackPlugin(),

    production &&
      !analyze &&
      // TODO: remove ignores when typings update to v6.x.x
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      new CopyWebpackPlugin({ patterns: [{ from: './static', to: './' }] }),

    ...(production && !analyze
      ? webpackCompression({
          cache: true,
          exclude: [/.*\.map$/],
          brotli: false,
        })
      : []),

    // new PurgecssPlugin({
    //   paths: () => [
    //     ...glob.sync(`${path.join(moduleRoot, 'src')}/**/*.{jsx,tsx}`, { nodir: true }), // prettier-ignore
    //   ],
    //   whitelist: htmlTags,
    // }),

    new LodashWebpackPlugin({
      caching: true,
      chaining: true,
      cloning: true,
      coercions: true,
      collections: true,
      currying: true,
      deburring: true,
      exotics: false,
      flattening: true,
      guards: true,
      memoizing: true,
      metadata: true,
      paths: true,
      placeholders: true,
      shorthands: true,
      unicode: false,
    }),

    new webpack.optimize.AggressiveMergingPlugin(),

    new ExtraWatchWebpackPlugin({
      files: [
        path.join(moduleRoot, 'src/.generated/**'),
        path.join(moduleRoot, 'src/types/**/*.d.ts'),
      ],
      dirs: [],
    }),

    new webpack.SourceMapDevToolPlugin({
      filename: 'sourcemaps/[filebase].map[query]',
      publicPath: '/',
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore: BUG: This parameter is missing in @types/webpack declarations
      fileContext: 'web',
      noSources: false,
    }),

    analyze &&
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: '0.0.0.0',
        analyzerPort: portAnalyze,
        openAnalyzer: false,
        defaultSizes: 'gzip',
      }),

    analyze &&
      new SizePlugin({
        writeFile: true,
        publish: false,
      }),

    new WorkerPlugin(),
  ].filter(Boolean),

  optimization: {
    moduleIds: analyze || development || debuggableProd ? 'named' : 'hashed',
    chunkIds: analyze || development || debuggableProd ? 'named' : 'total-size',
    flagIncludedChunks: true,
    concatenateModules: true,
    providedExports: true,
    usedExports: true,
    noEmitOnErrors: true,
    minimize: production,
    runtimeChunk: false,
    splitChunks: production && {
      automaticNameDelimiter: '.',
      chunks: 'all',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        vendors: false,
        runtimeChunk: false,
        default: {
          minChunks: 2,
          priority: -100,
          reuseExistingChunk: true,
        },
      },
    },
    minimizer: [
      production && webpackTerser({ sourceMaps, node: false, profile }),
      production &&
        new OptimizeCssAssetsPlugin({
          cssProcessorPluginOptions: {
            preset: [
              'default',
              {
                normalizeWhitespace: !development,
                discardComments: { removeAll: true },
              },
            ],
          },
        }),
    ].filter(Boolean),
  },
}
