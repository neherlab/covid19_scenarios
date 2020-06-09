import { ErrorArray } from '../../helpers/ErrorArray'

export class URLDecodingError extends ErrorArray {}

export class ErrorURLDecoderVersionInvalid extends URLDecodingError {
  public urlVer?: string | null

  public constructor(urlVer?: string | null, urlEncoderVersions?: string[]) {
    super(`when serializing expected \`v\` to be one of \`[${urlEncoderVersions}]\`, but received: ${urlVer}`) // prettier-ignore
    this.urlVer = urlVer
  }
}
