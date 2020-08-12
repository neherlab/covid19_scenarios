import FriendlyErrorsWebpackPlugin from '@nuxt/friendly-errors-webpack-plugin'
import { NextConfig } from 'next'
import WebpackBar from 'webpackbar'
import { addWebpackPlugin } from './lib/addWebpackPlugin'

interface FriendlyErrorsWebpackPluginError {
  message: string
  file: string
}

function cleanup() {
  return (error: FriendlyErrorsWebpackPluginError) => ({
    ...error,
    message: error.message.replace(/.*ERROR in.*\n/, '').replace(/.*WARNING in.*\n/, ''),
  })
}

function stripProjectRoot(projectRoot: string) {
  return (error: FriendlyErrorsWebpackPluginError) => ({
    ...error,
    message: error && error.message && error.message.replace(`${projectRoot}/`, ''),
    file: error && error.file && error.file.replace(`${projectRoot}/`, ''),
  })
}

export interface WithFriendlyConsoleParams {
  clearConsole: boolean
  projectRoot: string
  packageName: string
  progressBarColor: string
}

const getWithFriendlyConsole = ({
  clearConsole,
  projectRoot,
  packageName,
  progressBarColor,
}: WithFriendlyConsoleParams) => (nextConfig: NextConfig) => {
  const cfg = addWebpackPlugin(
    nextConfig,
    new FriendlyErrorsWebpackPlugin({
      clearConsole,
      additionalTransformers: [cleanup(), stripProjectRoot(projectRoot)],
      additionalFormatters: [],
    }),
  )

  return addWebpackPlugin(cfg, new WebpackBar({ name: packageName, color: progressBarColor }))
}

export default getWithFriendlyConsole
