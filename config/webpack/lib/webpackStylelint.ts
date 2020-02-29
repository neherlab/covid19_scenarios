import StylelintBarePlugin from 'stylelint-bare-webpack-plugin'

export default function webpackStylelint() {
  return new StylelintBarePlugin({
    files: '**/*.(css|sass|scss)',
    emitErrors: false,
    failOnError: false,
  })
}
