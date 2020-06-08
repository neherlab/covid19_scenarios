require('../dotenv')

const { findModuleRoot } = require('../../lib/findModuleRoot')

const { moduleRoot } = findModuleRoot()

module.exports = {
  rootDir: moduleRoot,
  roots: ['<rootDir>/src'],
  displayName: { name: 'test', color: 'cyan' },
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
  transform: {
    '^.+\\.(js|jsx)?$': 'babel-jest',
    '^.+\\.(md|mdx)$': 'jest-transformer-mdx',
  },
  testMatch: [
    '<rootDir>/src/**/*.(spec|test).{js,jsx,ts,tsx}',
    '<rootDir>/src/**/__test__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/test/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/tests/**/*.{js,jsx,ts,tsx}',
  ],
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(react-children-utilities)/)', '<rootDir>/cypress'],
  moduleNameMapper: {
    '\\.(eot|otf|webp|ttf|woff\\d?|svg|png|jpe?g|gif)$': '<rootDir>/config/jest/mocks/fileMock.js',
    '\\.(css|scss)$': 'identity-obj-proxy',
    'react-children-utilities': '<rootDir>/config/jest/mocks/mockReactChildrenUtilities.js',
    'react-i18next': '<rootDir>/config/jest/mocks/mockReactI18next.js',
    'popper-js': '<rootDir>/config/jest/mockPopperJS.js',
    'use-debounce': '<rootDir>/config/jest/mocks/mockUseDebounce.js',
  },
  setupFilesAfterEnv: [
    '<rootDir>/config/jest/setupDotenv.js',
    'jest-chain',
    'jest-extended',
    'jest-axe/extend-expect',
    '@testing-library/jest-dom/extend-expect',
  ],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
}
