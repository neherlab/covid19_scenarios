import path from 'path'

import { PluginOptions } from '@babel/core'

/**
 * Allows to whitelist certain node_modules to be processed by webpack.
 *
 * Credits: @jh3141
 * https://github.com/webpack/webpack/issues/2031#issuecomment-317589620
 *
 */
function excludeNodeModulesExcept(modules: string[]) {
  let pathSep: typeof path.sep | string = path.sep
  if (pathSep === '\\') {
    // must be quoted for use in a regexp:
    pathSep = '\\\\'
  }
  const moduleRegExps = modules.map(
    // eslint-disable-next-line security/detect-non-literal-regexp
    (modName: string) => new RegExp(`node_modules${pathSep}${modName}`),
  )

  return (modulePath: string) => {
    if (modulePath.includes('node_modules')) {
      // eslint-disable-next-line no-loops/no-loops
      for (const element of moduleRegExps) {
        if (element.test(modulePath)) {
          return false
        }
      }
      return true
    }
    return false
  }
}

export interface WebpackLoadJavaScriptParams {
  babelConfig: PluginOptions
  options?: PluginOptions
  eslintConfigFile?: string | boolean
  sourceMaps: boolean
  transpiledLibs?: string[]
}

export default function webpackLoadJavaScript({
  babelConfig,
  options = {},
  eslintConfigFile,
  sourceMaps,
  transpiledLibs = [],
}: WebpackLoadJavaScriptParams) {
  return [
    eslintConfigFile && {
      test: /\.(js|jsx|ts|tsx|json)$/,
      exclude: /(node_modules)/,
      enforce: 'pre',
      use: [
        {
          loader: 'eslint-loader',
          options: {
            cache: true,
            configFile: eslintConfigFile,
            failOnError: true,
            quiet: false,
          },
        },
      ],
    },
    sourceMaps && {
      test: /\.(js|jsx|ts|tsx|css|sass|scss|json)$/,
      enforce: 'pre',
      use: [
        {
          loader: 'source-map-loader',
        },
      ],
    },
    {
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: excludeNodeModulesExcept(transpiledLibs),
      use: [
        {
          loader: 'babel-loader',
          options: {
            ...babelConfig,
            compact: false,
            cacheDirectory: true,
            cacheCompression: false,
            sourceMaps,
            ...options,
          },
        },
      ],
    },
    {
      test: /\.(mdx?)$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            ...babelConfig,
            compact: false,
            cacheDirectory: true,
            cacheCompression: false,
            sourceMaps,
            ...options,
          },
        },
        {
          loader: '@mdx-js/loader',
          options: {
            remarkPlugins: [require('remark-images'), require('remark-math')],
            rehypePlugins: [require('rehype-katex')],
          },
        },
      ],
    },
  ].filter(Boolean)
}
