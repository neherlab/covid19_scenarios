import Redux from 'redux'

export declare interface ImmutableStateInvariantMiddlewareOptions {
  isImmutable?: (value: any) => boolean
  ignore?: string[]
}

export declare type ImmutableStateInvariantMiddleware = (
  options?: ImmutableStateInvariantMiddlewareOptions,
) => Redux.Middleware

declare const immutableStateInvariant: ImmutableStateInvariantMiddleware

export default immutableStateInvariant
