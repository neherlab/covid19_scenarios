const EnvVarError = require('./EnvVarError')

module.exports = {
  getenv(key, defaultValue) {
    const value = process.env[key]
    if (!value) {
      if (typeof defaultValue !== 'undefined' || defaultValue === null) {
        return defaultValue
      }

      throw new EnvVarError(key, value)
    }
    return value
  },

  getbool(key, defaultValue) {
    const value = process.env[key]
    if (!value) {
      if (typeof defaultValue !== 'undefined' || defaultValue === null) {
        return defaultValue
      }

      throw new EnvVarError(key, value)
    }

    return value === '1' || value === 'true' || value === 'yes'
  },
}
