import path from 'path'

import { isEmpty } from 'lodash'

import type { NextConfig } from 'next'
import getWithMDX from '@next/mdx'
import withBundleAnalyzer from '@zeit/next-bundle-analyzer'
import withPlugins from 'next-compose-plugins'
import nextRuntimeDotenv from 'next-runtime-dotenv'

import { findModuleRoot } from '../../lib/findModuleRoot'
import { getenv } from '../../lib/getenv'
import { getGitCommitHash } from '../../lib/getGitCommitHash'
import { getBuildUrl } from '../../lib/getBuildUrl'
import { getGitBranch } from '../../lib/getGitBranch'
import { getBuildNumber } from '../../lib/getBuildNumber'

import getWithEnvironment from './withEnvironment'
import getWithFriendlyConsole from './withFriendlyConsole'
import getWithLodash from './withLodash'
import withSvg from './withSvg'
import withWorker from './withWorker'

const MODE = getenv('NODE_ENV') === 'development' ? 'development' : 'production' // prettier-ignore
const production = MODE === 'production'
const development = MODE === 'development'
const analyze = getenv('ANALYZE', '0') === '1'
const profile = getenv('PROFILE', '0') === '1'
const debuggableProd = getenv('DEBUGGABLE_PROD', '0') === '1'
const sourceMaps = true
const DEV_ENABLE_I18N_DEBUG = getenv('DEV_ENABLE_I18N_DEBUG', '0')
const DEV_ENABLE_REDUX_IMMUTABLE_STATE_INVARIANT = getenv('DEV_ENABLE_REDUX_IMMUTABLE_STATE_INVARIANT', '0')
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

const nextConfig: NextConfig = {
  distDir: `.build/${process.env.NODE_ENV}/web`,
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 2,
  },
  experimental: {
    modern: true,
    productionBrowserSourceMaps: true,
  },
  future: {
    excludeDefaultMomentLocales: true,
  },
  devIndicators: {
    buildActivity: false,
    autoPrerender: true,
  },
}

const withConfig = nextRuntimeDotenv()

const withMDX = getWithMDX({ extension: /\.mdx?$/ })

const withFriendlyConsole = getWithFriendlyConsole({
  clearConsole: !analyze && fancyClearConsole,
  projectRoot: path.resolve(moduleRoot),
  packageName: pkg.name || 'web',
  progressBarColor: 'red',
})

const withEnvironment = getWithEnvironment({
  BABEL_ENV: process.env.BABEL_ENV,
  DEBUGGABLE_PROD: process.env.DEBUGGABLE_PROD,
  NODE_ENV: process.env.NODE_ENV,
  DEV_ENABLE_I18N_DEBUG,
  DEV_ENABLE_REDUX_IMMUTABLE_STATE_INVARIANT,
  IS_PRODUCTION: production,
  IS_DEVELOPMENT: development,
  ENV_NAME: getGitBranch(),
  PACKAGE_VERSION: pkg.version,
  BUILD_NUMBER: getBuildNumber(),
  TRAVIS_BUILD_WEB_URL: getBuildUrl(),
  REVISION: getGitCommitHash(),
  WEB_ROOT: getWebRoot(),
})

const withLodash = getWithLodash({ unicode: false })

const config = withConfig(
  withPlugins(
    [
      [withEnvironment],
      [withWorker],
      [withSvg],
      [withBundleAnalyzer],
      [withFriendlyConsole],
      [withMDX, { pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'] }],
      [withLodash],
    ],
    nextConfig,
  ),
)

export default config
