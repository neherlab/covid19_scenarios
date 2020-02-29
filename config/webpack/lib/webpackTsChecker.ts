/* eslint-disable unicorn/no-nested-ternary */
/* tslint:disable: no-empty */
import fs from 'fs-extra'
import os from 'os'

import { codeFrameColumns } from '@babel/code-frame'
import chalk from 'chalk'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { NormalizedMessage } from 'fork-ts-checker-webpack-plugin/lib/NormalizedMessage'

function identity<T>(t: T) {
  return t
}

function tsCheckerFormatter(
  message: NormalizedMessage,
  useColors: boolean,
): string {
  const messageColor = !useColors
    ? identity
    : message.isWarningSeverity()
    ? chalk.bold.yellow
    : chalk.bold.red
  const positionColor = chalk.dim

  const { file } = message

  const source = file && fs.existsSync(file) && fs.readFileSync(file, 'utf-8')

  let frame = ''
  if (source && message.line) {
    const location = {
      start: { line: message.line, column: message.character },
    }

    frame = codeFrameColumns(source, location, { highlightCode: useColors })
      .split('\n')
      .map(str => `  ${str}`)
      .join(os.EOL)
  }

  const codeColor = !useColors ? identity : chalk.grey

  const position = `${message.line}:${message.character}`
  const header = '' // `${message.severity.toUpperCase()} in ${message.file}`
  const errorCode = ` (${message.getFormattedCode()})`
  return `${messageColor(header) + os.EOL + positionColor(position)} ${
    message.content
  }${codeColor(errorCode)}${frame ? os.EOL + frame : ''}`
}

export interface WebpackTsCheckerOptions {
  tslint: string
  tsconfig: string
  reportFiles: string[]
  memoryLimit?: number
}

export default function webpackTsChecker({
  tslint,
  tsconfig,
  reportFiles,
  memoryLimit = 512, // Megabytes
}: WebpackTsCheckerOptions) {
  return new ForkTsCheckerWebpackPlugin({
    useTypescriptIncrementalApi: true,
    memoryLimit,
    eslint: true,
    tslint,
    tsconfig,
    formatter: tsCheckerFormatter,
    checkSyntacticErrors: true,
    async: false,
    silent: true,
    reportFiles,
  })
}
