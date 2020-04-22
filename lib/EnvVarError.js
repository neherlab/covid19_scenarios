class EnvVarError extends TypeError {
  constructor(key, value) {
    super(`
      When reading an environement variable "${key}" (as \`process.env.${key}\`):
      it was expected to find a valid string, but found \`${value}\`.

      Have you followed the instructions in Developer's guide?

      There might have been additions to the list of environement variables required.
      Verify that your \`.env\` file has all the variables present in \`.env.example\`:

        diff --color .env.example .env

      In simple cases you might just copy the example:

        cp .env.example .env

      `)
  }
}

module.exports = EnvVarError
