export enum ProcessingErrorCode {
  MissingTimeField,
  InvalidField,
}

/**
 * A custom exception thrown during data file parsing.
 */
export class ProcessingError extends Error {
  constructor(readonly errorCode: ProcessingErrorCode, message?: string) {
    super(message)
  }
}
