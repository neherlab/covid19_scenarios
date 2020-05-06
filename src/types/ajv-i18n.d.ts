import { ErrorObject } from 'ajv'

export declare type AjvI18nLocalizeFunction = (errors: ErrorObject[]) => void

export declare interface AjvI18n {
  [key: string]: AjvI18nLocalizeFunction
}

declare const ajvLocalizers = {} as AjvI18n

export default ajvLocalizers
