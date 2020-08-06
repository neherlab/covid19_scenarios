require('../dotenv')

const path = require('path')

const { findModuleRoot } = require('../../lib/findModuleRoot')

const { moduleRoot } = findModuleRoot()

const shouldRunEslint = process.env.WITH_ESLINT === '1'

module.exports = {
  rootDir: moduleRoot,

  projects: [require('./jest.tests.config.js'), shouldRunEslint && require('./jest.eslint.config.js')].filter(Boolean),

  coverageDirectory: path.join(moduleRoot, '.reports', 'coverage'),

  collectCoverageFrom: [
    '!<rootDir>/**/*.d.ts',
    '!<rootDir>/**/node_modules/**/*',
    '<rootDir>/src/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/src/index.polyfilled.{js,jsx,ts,tsx}',
    '!<rootDir>/src/locales/**/*',
  ],

  coverageThreshold: {
    global: {
      // TODO: write more tests?
      // branches: 33,
      // functions: 33,
      // lines: 33,
      // statements: 33,
    },
  },
}
