const EnvVarError = require('./EnvVarError')

module.exports = {
  getenv(key, defaultValue) {
    const value = process.env[key]
    if (!value) {
      if (defaultValue || defaultValue === null) {
        return defaultValue
      }

      throw new EnvVarError(key, value)
    }
    return value
  },
}
