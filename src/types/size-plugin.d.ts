export interface SizePluginOptions {
  pattern?: string
  exclude?: string
  filename?: string
  publish?: boolean
  writeFile?: boolean
  stripHash?(filename: string): string
}

declare class SizePlugin {
  constructor(options: SizePluginOptions)
}

export default SizePlugin
