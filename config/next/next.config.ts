import path from 'path'

import type { NextConfig } from 'next'
import getWithMDX from '@next/mdx'
// import withBundleAnalyzer from '@zeit/next-bundle-analyzer'
import withPlugins from 'next-compose-plugins'
import nextRuntimeDotenv from 'next-runtime-dotenv'

import { findModuleRoot } from '../../lib/findModuleRoot'
import { getenv, getbool } from '../../lib/getenv'
import { getGitBranch } from '../../lib/getGitBranch'
import { getBuildNumber } from '../../lib/getBuildNumber'
import { getBuildUrl } from '../../lib/getBuildUrl'
import { getGitCommitHash } from '../../lib/getGitCommitHash'

import { getWebRoot } from './lib/getWebRoot'

import getWithAssets from './withAssets'
import getWithEnvironment from './withEnvironment'
import getWithFriendlyConsole from './withFriendlyConsole'
import getWithLodash from './withLodash'
import getWithStaticCompression from './withStaticCompression'
import getWithTypeChecking from './withTypeChecking'
import withSvg from './withSvg'
import withWorker from './withWorker'

const BABEL_ENV = getenv('BABEL_ENV')
const NODE_ENV = getenv('NODE_ENV')
const production = NODE_ENV === 'production'
// const development = NODE_ENV === 'development'
// const ANALYZE = getbool('ANALYZE')
// const PROFILE = getbool('PROFILE')
const DEV_ENABLE_TYPE_CHECKS = getenv('DEV_ENABLE_TYPE_CHECKS')
const DEV_ENABLE_ESLINT = getbool('DEV_ENABLE_ESLINT')
// const DEV_ENABLE_STYLELINT = getbool('DEV_ENABLE_STYLELINT')
const DEV_ENABLE_REDUX_DEV_TOOLS = getenv('DEV_ENABLE_REDUX_DEV_TOOLS')
const DEV_ENABLE_REDUX_IMMUTABLE_STATE_INVARIANT = getenv('DEV_ENABLE_REDUX_IMMUTABLE_STATE_INVARIANT')
const PROD_ENABLE_SOURCE_MAPS = getbool('PROD_ENABLE_SOURCE_MAPS')
const PROD_ENABLE_REDUX_DEV_TOOLS = getenv('PROD_ENABLE_REDUX_DEV_TOOLS')
const PROD_ENABLE_REDUX_IMMUTABLE_STATE_INVARIANT = getenv('PROD_ENABLE_REDUX_IMMUTABLE_STATE_INVARIANT')

const ENABLE_REDUX_DEV_TOOLS = production ? PROD_ENABLE_REDUX_DEV_TOOLS : DEV_ENABLE_REDUX_DEV_TOOLS
const ENABLE_REDUX_IMMUTABLE_STATE_INVARIANT = production ? PROD_ENABLE_REDUX_IMMUTABLE_STATE_INVARIANT : DEV_ENABLE_REDUX_IMMUTABLE_STATE_INVARIANT // prettier-ignore
const ENABLE_ESLINT = production || DEV_ENABLE_ESLINT

const { pkg, moduleRoot } = findModuleRoot()

const nextConfig: NextConfig = {
  distDir: `.build/${process.env.NODE_ENV}/tmp`,
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 2,
  },
  experimental: {
    modern: true,
    productionBrowserSourceMaps: PROD_ENABLE_SOURCE_MAPS,
  },
  future: {
    excludeDefaultMomentLocales: true,
  },
  devIndicators: {
    buildActivity: false,
    autoPrerender: true,
  },
  typescript: {
    ignoreDevErrors: true,
    ignoreBuildErrors: true,
  },
}

const withConfig = nextRuntimeDotenv()

const withMDX = getWithMDX({
  extension: /\.mdx?$/,
  remarkPlugins: ['remark-images', 'remark-math'].map(require),
  rehypePlugins: ['rehype-katex'].map(require),
})

const withAssets = getWithAssets()

const withFriendlyConsole = getWithFriendlyConsole({
  clearConsole: false,
  projectRoot: path.resolve(moduleRoot),
  packageName: pkg.name || 'web',
  progressBarColor: 'red',
})

const withEnvironment = getWithEnvironment({
  BABEL_ENV,
  NODE_ENV,
  ENABLE_REDUX_DEV_TOOLS,
  ENABLE_REDUX_IMMUTABLE_STATE_INVARIANT,
  WEB_ROOT: getWebRoot({ production }),
  BRANCH_NAME: getGitBranch(),
  PACKAGE_VERSION: pkg.version ?? '',
  BUILD_NUMBER: getBuildNumber(),
  TRAVIS_BUILD_WEB_URL: getBuildUrl(),
  REVISION: getGitCommitHash(),
})

const withLodash = getWithLodash({ unicode: false })

const withStaticCompression = getWithStaticCompression({ brotli: false })

const withTypeChecking = getWithTypeChecking({
  eslint: ENABLE_ESLINT,
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
    '!src/components/Main/Results/Utils.ts', // FIXME
    // end

    '!src/**/*.(spec|test).{js,jsx,ts,tsx}',
    '!src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '!src/*generated*/**/*',
    '!src/algorithms/__test_data__/**/*',
    '!src/styles/**/*',
    '!static/**/*',
  ],
})

const config = withConfig(
  withPlugins(
    [
      [withEnvironment],
      [withWorker],
      [withSvg],
      [withAssets],
      // ANALYZE && [withBundleAnalyzer],
      [withFriendlyConsole],
      [withMDX, { pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'] }],
      [withLodash],
      DEV_ENABLE_TYPE_CHECKS && [withTypeChecking],
      production && [withStaticCompression],
    ].filter(Boolean),
    nextConfig,
  ),
)

export default config
