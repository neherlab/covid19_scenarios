require('./config/dotenv')

function isWebTarget(caller) {
  return Boolean(caller && caller.target === 'web')
}

const development = process.env.NODE_ENV === 'development'
const production = process.env.NODE_ENV === 'production'
const analyze = process.env.ANALYZE === '1'
const debuggableProd = process.env.DEBUGGABLE_PROD === '1'

module.exports = (api) => {
  const web = api.caller(isWebTarget)

  return {
    compact: false,
    presets: ['next/babel'],
    plugins: [
      '@babel/plugin-proposal-numeric-separator',
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
