require('./config/dotenv')

function isWebTarget(caller) {
  return Boolean(caller && caller.target === 'web')
}

function isWebpack(caller) {
  return Boolean(caller && caller.name === 'babel-loader')
}

const development = process.env.NODE_ENV === 'development'
const production = process.env.NODE_ENV === 'production'
const analyze = process.env.ANALYZE === '1'
const debuggableProd = process.env.DEBUGGABLE_PROD === '1'
const loose = true

module.exports = api => {
  const web = api.caller(isWebTarget)
  const webpack = api.caller(isWebpack)

  return {
    compact: false,
    sourceType: 'unambiguous',
    presets: [
      '@babel/preset-typescript',
      [
        '@babel/preset-env',
        {
          useBuiltIns: web ? 'entry' : undefined,
          corejs: web ? 'core-js@3' : false,
          targets: !web ? { node: 'current' } : undefined,
          modules: webpack ? false : 'commonjs',
          loose,
          shippedProposals: development,
          exclude: ['transform-typeof-symbol'],
        },
      ],
      ['@babel/preset-react', { useBuiltIns: web, development }],
    ],
    plugins: [
      development && web && 'react-refresh/babel',
      ['@babel/plugin-proposal-numeric-separator', { loose }],
      'babel-plugin-lodash',
      (development || debuggableProd) && web && !analyze && ['babel-plugin-typescript-to-proptypes', { typeCheck: './src/**/*.ts' }], // prettier-ignore
      (development || debuggableProd) && web && !analyze && 'babel-plugin-redux-saga', // prettier-ignore
      (development || analyze || debuggableProd) && web && 'babel-plugin-smart-webpack-import', // prettier-ignore
      production && web && ['babel-plugin-transform-react-remove-prop-types', { removeImport: true }], // prettier-ignore
      production && web && '@babel/plugin-transform-flow-strip-types',
      !(development || debuggableProd) && web && '@babel/plugin-transform-react-inline-elements', // prettier-ignore
      !(development || debuggableProd) && web && '@babel/plugin-transform-react-constant-elements', // prettier-ignore
    ].filter(Boolean),
  }
}
