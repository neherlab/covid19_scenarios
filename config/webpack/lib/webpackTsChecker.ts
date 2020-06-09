import fs from 'fs-extra'
import os from 'os'

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import chalk from 'chalk'
import isInteractive from 'is-interactive'
import { codeFrameColumns } from '@babel/code-frame'

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
    const { origin, code, message, file, line, character } = issue

    if (origin === IssueOrigin.INTERNAL) {
      return createInternalFormatter()(issue)
    }

    const useColors = isInteractive()

    // NOTE: this forces all issues to become warnings
    issue.severity = IssueSeverity.WARNING
    if (warningsAreErrors) {
      // NOTE: this forces all issues to become errors
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

    const codeColor = useColors ? chalk.grey : identity

    const position = positionColor(`${line}:${character}`)

    let errorCode = `${code}`
    if (origin === 'typescript') {
      errorCode = `TS${errorCode}`
    }
    errorCode = `(${errorCode})`
    errorCode = codeColor(errorCode)

    const eol = os.EOL

    return `  ${position}${eol}  ${errorCode}${eol}  ${message}${eol}${eol}${frame}`
  }
}

export interface WebpackTsCheckerOptions {
  warningsAreErrors: boolean
  tsconfig: string
  reportFiles: string[]
  memoryLimit?: number
}

export default function webpackTsChecker({
  warningsAreErrors,
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
