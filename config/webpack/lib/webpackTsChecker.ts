import fs from 'fs-extra'
import os from 'os'

import isInteractive from 'is-interactive'
import { codeFrameColumns } from '@babel/code-frame'
import chalk from 'chalk'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'

import {
  Issue,
  IssueSeverity,
  IssueOrigin,
} from 'fork-ts-checker-webpack-plugin/lib/issue'
import { createInternalFormatter } from 'fork-ts-checker-webpack-plugin/lib/formatter'

function identity<T>(t: T) {
  return t
}

export interface CreateFormatterParams {
  warningsAreErrors: boolean
}

export function createFormatter({ warningsAreErrors }: CreateFormatterParams) {
  return (issue: Issue): string => {
    const { origin, severity, code, message, file, line, character } = issue

    if (origin === IssueOrigin.INTERNAL) {
      return createInternalFormatter()(issue)
    }

    const useColors = isInteractive()

    let messageColor = identity
    if (useColors) {
      if (severity === IssueSeverity.WARNING) {
        messageColor = chalk.bold.yellow
      } else {
        messageColor = chalk.bold.red
      }
    }

    // NOTE: this forces all issues to become warnings
    // eslint-disable-next-line no-param-reassign
    issue.severity = IssueSeverity.WARNING
    if (warningsAreErrors) {
      // NOTE: this forces all issues to become errors
      // eslint-disable-next-line no-param-reassign
      issue.severity = IssueSeverity.WARNING
    }

    const positionColor = chalk.dim

    const source = file && fs.existsSync(file) && fs.readFileSync(file, 'utf-8')

    let frame = ''
    if (source && line) {
      const location = {
        start: {
          line,
          column: character,
        },
      }

      frame = codeFrameColumns(source, location, {
        highlightCode: useColors,
      })
        .split('\n')
        .map((str) => `  ${str}`)
        .join(os.EOL)
    }

    const codeColor = !useColors ? identity : chalk.grey

    const position = `${line}:${character}`
    const header = ''
    const errorCode = ` (${code})`
    return `${
      messageColor(header) + os.EOL + positionColor(position)
    } ${message}${codeColor(errorCode)}${frame ? os.EOL + frame : ''}`
  }
}

export interface WebpackTsCheckerOptions {
  warningsAreErrors: boolean
  tslint: string
  tsconfig: string
  reportFiles: string[]
  memoryLimit?: number
}

export default function webpackTsChecker({
  warningsAreErrors,
  tslint,
  tsconfig,
  reportFiles,
  memoryLimit = 512, // Megabytes
}: WebpackTsCheckerOptions) {
  return new ForkTsCheckerWebpackPlugin({
    useTypescriptIncrementalApi: true,
    measureCompilationTime: true,
    memoryLimit,
    eslint: true,
    tsconfig,
    formatter: createFormatter({ warningsAreErrors }),
    checkSyntacticErrors: true,
    async: false,
    silent: true,
    reportFiles,
  })
}
