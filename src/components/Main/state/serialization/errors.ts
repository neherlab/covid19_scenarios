import { appendDash } from '../../../../helpers/appendDash'

export class URLDecodingError extends Error {}

export class ErrorURLSerializerVersionInvalid extends URLDecodingError {
  public urlVer?: string | null

  public constructor(urlVer?: string | null, urlEncoderVersions?: string[]) {
    super(`when serializing expected \`v\` to be one of \`[${urlEncoderVersions}]\`, but received: ${urlVer}`) // prettier-ignore
    this.urlVer = urlVer
  }
}

export class DeserializationError extends Error {
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
  public readonly schemaVer?: string
  public readonly errors?: string[]

  public constructor(schemaVer?: string, schemaVersions?: string[]) {
    const error = `expected \`schemaVer\` to be one of \`[${schemaVersions}]\`, but received: ${schemaVer}`
    super(`when deserializing: ${error}`)
    this.schemaVer = schemaVer
    this.errors = [error]
  }
}

export class DeserializationErrorValidationFailed extends DeserializationError {
  public errors?: string[]

  public constructor(errors?: string[]) {
    super(`when deserializing: validation failed:\n${errors?.map(appendDash).join('\n')}`)
    this.errors = errors
  }
}

export class DeserializationErrorConversionFailed extends DeserializationError {
  public errors?: string[]

  public constructor(error?: string) {
    super(`when deserializing: conversion failed: ${error}`)
    this.errors = error ? [error] : ['unknown error']
  }
}

export class SerializationError extends Error {}

export class ErrorSchemaSerializerVersionNotLatest extends SerializationError {
  public schemaVer: string
  public errors?: string[]

  public constructor(schemaVer: string, schemaVersions: string[]) {
    const error = `when serializing: expected \`schemaVer\` to be the latest among \`[${schemaVersions}]\`, but received: ${schemaVer}` // prettier-ignore
    super(`when serializing: ${error}`)
    this.schemaVer = schemaVer
    this.errors = [error]
  }
}
