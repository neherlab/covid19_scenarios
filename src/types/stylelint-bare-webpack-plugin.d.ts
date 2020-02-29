import { Formatter } from 'stylelint'

export interface StylelintBarePluginOptions {
  files?: string
  emitErrors?: boolean
  failOnError?: boolean
  formatter?: Formatter
}

declare class StylelintBarePlugin {
  constructor(options: StylelintBarePluginOptions)
}

export default StylelintBarePlugin
