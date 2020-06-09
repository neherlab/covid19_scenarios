import { appendDash } from '../../helpers/appendDash'
import { ErrorArray } from '../../helpers/ErrorArray'

export class CSVParserError extends ErrorArray {
  public readonly errors?: string[]
}

export class CSVParserErrorCSVSyntaxInvalid extends CSVParserError {
  public errors?: string[]

  public constructor(errors?: string[]) {
    super(`when parsing CSV: syntax error:\n${errors?.map(appendDash).join('\n')}`)
    this.errors = errors
  }
}
