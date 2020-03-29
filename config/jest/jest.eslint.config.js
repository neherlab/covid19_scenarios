require('../dotenv')

const { findModuleRoot } = require('../../lib/findModuleRoot')

const { moduleRoot } = findModuleRoot()

module.exports = {
  rootDir: moduleRoot,
  roots: ['<rootDir>/src'],
  runner: 'jest-runner-eslint',
  displayName: { name: 'lint', color: 'blue' },
  testEnvironment: 'jest-environment-jsdom',
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      babelConfig: true,
      diagnostics: {
        pathRegex: /(\/__tests?__\/.*|([./])(test|spec))\.[jt]sx?$/,
        warnOnly: true,
      },
    },
  },
  testMatch: [
    '<rootDir>/src/**/*.(spec|test).{js,jsx,ts,tsx}',
    '<rootDir>/src/**/__test__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/test/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/tests/**/*.{js,jsx,ts,tsx}',
  ],
  watchPlugins: [
    'jest-runner-eslint/watch-fix', // prettier-ignore
  ],
}
