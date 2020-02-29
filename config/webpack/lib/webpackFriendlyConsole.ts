import FriendlyErrorsWebpackPlugin from '@nuxt/friendly-errors-webpack-plugin'
import WebpackBar from 'webpackbar'

interface FriendlyErrorsWebpackPluginError {
  message: string
  file: string
}

function cleanup() {
  return (error: FriendlyErrorsWebpackPluginError) => ({
    ...error,
    message: error.message
      .replace(/.*ERROR in.*\n/, '')
      .replace(/.*WARNING in.*\n/, ''),
  })
}

function stripProjectRoot(projectRoot: string) {
  return (error: FriendlyErrorsWebpackPluginError) => ({
    ...error,
    message:
      error && error.message && error.message.replace(`${projectRoot}/`, ''),
    file: error && error.file && error.file.replace(`${projectRoot}/`, ''),
  })
}

export interface WebpackFriendlyConsoleParams {
  clearConsole: boolean
  projectRoot: string
  packageName: string
  progressBarColor: string
}

export default function webpackFriendlyConsole({
  clearConsole,
  projectRoot,
  packageName,
  progressBarColor,
}: WebpackFriendlyConsoleParams) {
  return [
    new FriendlyErrorsWebpackPlugin({
      clearConsole,
      additionalTransformers: [cleanup(), stripProjectRoot(projectRoot)],
      additionalFormatters: [],
    }),

    new WebpackBar({ name: packageName, color: progressBarColor }),
  ]
}
