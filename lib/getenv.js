module.exports = {
  getenv(key, defaultValue) {
    const value = process.env[key]
    if (!value) {
      if (defaultValue) {
        return defaultValue
      }

      throw new TypeError(`"process.env.${key}" is expected to be a valid string, but got "${value}"`)
    }
    return value
  },
}
