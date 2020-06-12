import { appendDash } from '../../helpers/appendDash'
import { ErrorArray } from '../../helpers/ErrorArray'

export class DeserializationError extends ErrorArray {
  public readonly errors?: string[]
}

export class DeserializationErrorJsonSyntaxInvalid extends DeserializationError {
  public readonly errors?: string[]

  public constructor(syntaxErrorMessage: string) {
    const error = `invalid JSON syntax: '${syntaxErrorMessage}'`
    super(`when deserializing: ${error}`)
    this.errors = [error]
  }
}

export class DeserializationErrorSchemaVersionMissing extends DeserializationError {
  public readonly errors?: string[]

  public constructor() {
    const error = `\`schemaVer\` is missing`
    super(`when deserializing: ${error}`)
    this.errors = [error]
  }
}

export class DeserializationErrorSchemaVersionInvalid extends DeserializationError {
  public readonly schemaVer: string
  public readonly errors: string[]

  public constructor(schemaVer: string, schemaVersions: string[]) {
    const error = `expected \`schemaVer\` to be one of \`[${schemaVersions?.join(', ')}]\`, but received: ${schemaVer}`
    super(`when deserializing: ${error}`)
    this.schemaVer = schemaVer
    this.errors = [error]
  }
}

export class DeserializationErrorValidationFailed extends DeserializationError {
  public errors: string[]

  public constructor(errors: string[]) {
    super(`when deserializing: validation failed:\n${errors.map(appendDash).join('\n')}`)
    this.errors = errors
  }
}

export class DeserializationErrorConversionFailed extends DeserializationError {
  public errors?: string[]

  public constructor(conversionError?: string) {
    let error = `conversion failed`
    if (conversionError) {
      error = `${error}: ${conversionError}`
    }
    super(`when deserializing: ${error}`)
    this.errors = [error]
  }
}

export class SerializationError extends ErrorArray {}

export class SerializationErrorSchemaVersionNotLatest extends SerializationError {
  public schemaVer: string
  public errors: string[]

  public constructor(schemaVer: string, schemaVersions: string[]) {
    const error = `when serializing: expected \`schemaVer\` to be the latest among \`[${schemaVersions.join(', ')}]\`, but received: ${schemaVer}` // prettier-ignore
    super(`when serializing: ${error}`)
    this.schemaVer = schemaVer
    this.errors = [error]
  }
}
