module.exports = {
  getenv(key, defaultValue) {
    const value = process.env[key]
    if (!value) {
      if (defaultValue) {
        return defaultValue
      }

      throw new TypeError(`
      When reading an environement variable "${key}" (as \`process.env.${key}\`):
      it was expected to find a valid string, but found \`${value}\`.

      Have you followed the instructions in Developer's guide?

      There might have been additions to the list of environement variables required.
      Verify that your \`.env\` file has all the variables present in \`.env.example\`.
      In simple cases you might just copy the example:
        cp .env.example .env
      `)
    }
    return value
  },
}
