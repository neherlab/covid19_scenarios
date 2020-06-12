import { ErrorArray } from '../../helpers/ErrorArray'

export class URLDecodingError extends ErrorArray {}

export class ErrorURLDecoderVersionInvalid extends URLDecodingError {
  public urlVer: string

  public constructor(urlVer: string, urlEncoderVersions: string[]) {
    super(`when serializing expected \`v\` to be one of \`[${urlEncoderVersions.join(', ')}]\`, but received: ${urlVer}`) // prettier-ignore
    this.urlVer = urlVer
  }
}
