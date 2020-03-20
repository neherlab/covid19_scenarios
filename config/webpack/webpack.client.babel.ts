import '../dotenv'

import path from 'path'

import glob from 'glob-all'

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
import htmlTags from './lib/htmlTags'

import babelConfig from '../../babel.config'

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
const devServerPort = getenv('WEB_DEV_SERVER_PORT', '3000')
const analyzerPort = parseInt(getenv('WEB_DEV_BUNDLE_ANALYZER_PORT', '8888'), 10) // prettier-ignore
const fancyConsole = getenv('DEV_FANCY_CONSOLE', '0') === '1'
const fancyClearConsole = getenv('DEV_FANCY_CLEAR_CONSOLE', '0') === '1'
const disableLint = getenv('DEV_DISABLE_LINT', '0') === '1'

const { moduleRoot, pkg } = findModuleRoot()
const buildPath = path.join(moduleRoot, '.build', analyze ? 'analyze' : MODE, 'web') // prettier-ignore

function alias(development: boolean) {
  let productionAliases = {}

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

function entry(development: boolean, entries: string[]) {
  if (development || debuggableProd) {
    return [
      'map.prototype.tojson', // to visualize Map in Redux Dev Tools
      'set.prototype.tojson', // to visualize Set in Redux Dev Tools
      ...entries,
    ]
  }
  return entries
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

  entry: entry(development, [path.join(moduleRoot, `src/index.polyfilled.ts`)]),

  output: {
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
      app.use(express.static(path.join(buildPath, '..', 'sourcemaps')))
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
    port: devServerPort,
    publicPath: '/',
    quiet: false,
    logLevel: 'info',
    clientLogLevel: 'warning',
    writeToDisk: true,
  },

  module: {
    rules: [
      ...webpackLoadJavascript({
        babelConfig,
        options: { caller: { target: 'web' } },
        sourceMaps,
        transpiledLibs: [
          '@loadable',
          '@redux-saga',
          'delay',
          'immer',
          'lodash',
          'p-min-delay',
          'react-router',
          'redux/es',
        ],
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
      'source',
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

    !disableLint && !analyze && webpackStylelint(),

    !disableLint &&
      !analyze &&
      webpackTsChecker({
        memoryLimit: 1024,
        tslint: path.join(moduleRoot, 'tslint.json'),
        tsconfig: path.join(moduleRoot, 'tsconfig.json'),
        reportFiles: [
          'src/**/*.{js,jsx,ts,tsx}',
          '!src/**/__tests__/**/*.{js,jsx,ts,tsx}',
          '!src/**/*.(spec|test).{js,jsx,ts,tsx}',
          '!static/**/*',
        ],
      }),

    new webpack.EnvironmentPlugin({
      BABEL_ENV: process.env.BABEL_ENV,
      DEBUGGABLE_PROD: process.env.DEBUGGABLE_PROD,
      NODE_ENV: process.env.NODE_ENV,
    }),

    ...(fancyConsole
      ? webpackFriendlyConsole({
          clearConsole: !analyze && fancyClearConsole,
          projectRoot: path.resolve(moduleRoot),
          packageName: pkg.name || 'web',
          progressBarColor: 'red',
        })
      : []),

    new MiniCssExtractPlugin({
      filename: outputFilename(development, 'css'),
      chunkFilename: outputFilename(development, 'css'),
    }),

    development && new ReactRefreshWebpackPlugin({ disableRefreshCheck: true }),

    production &&
      !analyze &&
      new CopyWebpackPlugin([{ from: './static', to: './' }]),

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

    // Setup for `moment` locales
    new webpack.ContextReplacementPlugin(/^\.\/locale$/, context => {
      if (!context.context.includes('/moment/')) {
        return
      }
      // context needs to be modified in place
      Object.assign(context, {
        // include only CJK
        regExp: /^\.\/(en|de)/,
        // point to the locale data folder relative to moment's src/lib/locale
        request: '../../locale',
      })
    }),

    new webpack.optimize.AggressiveMergingPlugin(),

    new ExtraWatchWebpackPlugin({
      files: [
        path.join(moduleRoot, 'generated/**'),
        path.join(moduleRoot, 'src/types/**/*.d.ts'),
      ],
      dirs: [],
    }),

    new webpack.SourceMapDevToolPlugin({
      filename: '../sourcemaps/[filebase].map[query]',
      publicPath: '/sourcemaps/',
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore: BUG: This parameter is missing in @types/webpack declarations
      fileContext: 'web/content/sourcemaps',
      noSources: true,
    }),

    analyze &&
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: '0.0.0.0',
        analyzerPort,
        openAnalyzer: false,
        defaultSizes: 'gzip',
      }),

    analyze &&
      new SizePlugin({
        writeFile: true,
        publish: false,
      }),
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
