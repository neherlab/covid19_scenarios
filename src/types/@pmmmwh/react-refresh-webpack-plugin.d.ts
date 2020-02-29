declare module '@pmmmwh/react-refresh-webpack-plugin' {
  export declare interface ReactRefreshWebpackPluginOptions {
    /**
     * Disables detection of react-refresh's Babel plugin. Useful if you do not
     * parse JS files within node_modules, or if you have a Babel setup not
     * entirely controlled by Webpack.
     *
     * default: false
     */
    disableRefreshCheck?: boolean

    /**
     * Enables the plugin forcefully. Useful if you want to use the plugin in
     * production, or if you are using Webpack's none mode without NODE_ENV, for
     * example.
     *
     * default: false
     */
    forceEnable?: boolean
  }

  declare class ReactRefreshWebpackPlugin {
    public constructor(ReactRefreshWebpackPluginOptions?: options)
  }

  export default ReactRefreshWebpackPlugin
}
