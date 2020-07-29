import webpack from 'webpack'

export interface ThreadsPluginOptions {
  globalObject?: boolean | string
  plugins?: Array<string | webpack.Plugin>
  target?: string
}

declare class WorkerPlugin extends webpack.Plugin {
  constructor(options?: ThreadsPluginOptions)
}

export default WorkerPlugin
