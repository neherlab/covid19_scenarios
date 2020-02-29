require('./config/dotenv')

module.exports = {
  plugins: {
    'postcss-preset-env': {
      stage: 2,
      features: {
        'postcss-custom-properties': { preserve: false },
      },
      autoprefixer: {
        remove: false,
        grid: true,
        flexbox: true,
      },
    },
  },
}
