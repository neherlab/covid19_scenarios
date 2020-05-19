require('./config/dotenv')

module.exports = {
  defaultSeverity: 'warning',
  extends: [
    'stylelint-config-standard',
    'stylelint-config-css-modules',
    'stylelint-config-primer',

    // stylelint-scss goes after everything else
    'stylelint-config-recommended-scss',

    // prettier goes last
    'stylelint-config-prettier',
  ],
  plugins: [
    'stylelint-declaration-block-no-ignored-properties',
    'stylelint-high-performance-animation',
    'stylelint-no-indistinguishable-colors',

    // stylelint-scss goes after everything else
    'stylelint-scss',

    // prettier goes last
    'stylelint-prettier',
  ],
  rules: {
    'plugin/declaration-block-no-ignored-properties': true,
    'plugin/no-low-performance-animation-properties': true,
    'plugin/no-unsupported-browser-features': null, // disable feature checks: we use postcss-preset-env and autoprefixer
    'plugin/stylelint-no-indistinguishable-colors': true,

    'no-descending-specificity': [true, { ignore: ['selectors-within-list'] }],
    'prettier/prettier': true,
    'selector-max-compound-selectors': 4,
    'selector-max-specificity': '0,5,1',
    'selector-max-type': null,
  },
}
