module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
      globalReturn: false,
    },
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './cypress/tsconfig.json'],
    warnOnUnsupportedTypeScriptVersion: true,
  },
  globals: {},
  extends: [
    'eslint:recommended',
    'airbnb',
    'react-app',

    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:array-func/all',
    'plugin:import/errors',
    'plugin:import/typescript',
    'plugin:import/warnings',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:jsx-a11y/recommended',
    'plugin:lodash/recommended',
    'plugin:promise/recommended',
    'plugin:react-redux/recommended',
    'plugin:react/recommended',
    'plugin:redux-saga/recommended',
    'plugin:security/recommended',
    'plugin:sonarjs/recommended',
    'plugin:unicorn/recommended',

    // prettier should go last
    'plugin:prettier/recommended',
    'prettier/react',
    'prettier/@typescript-eslint',
  ],
  plugins: [
    'array-func',
    'cflint',
    'import',
    'jest',
    'jsx-a11y',
    'lodash',
    'no-loops',
    'no-secrets',
    'node',
    'only-ascii',
    'promise',
    'react',
    'react-hooks',
    'react-redux',
    'redux-saga',
    'security',
    'sonarjs',
    'unicorn',

    'only-warn',

    '@typescript-eslint',

    // prettier should go last
    'prettier',
  ],
  reportUnusedDisableDirectives: true,
  rules: {
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/unbound-method': ['off'],
    'array-func/prefer-array-from': 'off',
    'cflint/no-substr': 'warn',
    'cflint/no-this-assignment': 'warn',
    'import/extensions': [
      'warn',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        mjs: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-extraneous-dependencies': ['warn', { devDependencies: true }],
    'import/order': 'warn',
    'import/prefer-default-export': 'off',
    'jest/consistent-test-it': 'warn',
    'jest/expect-expect': 'warn',
    'jest/no-test-callback': 'warn',
    'jsx-a11y/label-has-associated-control': ['warn', { assert: 'either' }],
    'lodash/chaining': 'off',
    'lodash/import-scope': 'off',
    'lodash/prefer-constant': 'off',
    'lodash/prefer-lodash-chain': 'off',
    'lodash/prefer-lodash-method': 'off',
    'lodash/prefer-lodash-typecheck': 'off',
    'max-classes-per-file': 'off',
    'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
    'no-loops/no-loops': 'warn',
    'no-param-reassign': ['warn', { ignorePropertyModificationsFor: ['draft'] }],
    'no-secrets/no-secrets': ['warn', { tolerance: 5 }],
    'no-shadow': 'off',
    'only-ascii/only-ascii': 'warn',
    'prefer-for-of': 'off',
    'prettier/prettier': 'warn',
    'react-redux/prefer-separate-component-file': 'off',
    'react/jsx-curly-brace-presence': 'off',
    'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/state-in-constructor': 'off',
    'redux-saga/no-unhandled-errors': 'off',
    'security/detect-non-literal-fs-filename': 'off',
    'security/detect-object-injection': 'off',
    'sonarjs/cognitive-complexity': ['warn', 20],
    'unicorn/escape-case': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/new-for-builtins': 'off',
    'unicorn/no-abusive-eslint-disable': 'warn',
    'unicorn/no-fn-reference-in-iterator': 'off',
    'unicorn/no-null': 'off',
    'unicorn/no-reduce': 'off',
    'unicorn/no-useless-undefined': 'off',
    'unicorn/no-zero-fractions': 'off',
    'unicorn/prefer-query-selector': 'off',
    'unicorn/prefer-spread': 'off',
    'unicorn/prevent-abbreviations': 'off',

    'lines-between-class-members': ['warn', 'always', { exceptAfterSingleLine: true }],

    'require-await': 'off',
    '@typescript-eslint/require-await': 'off',

    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': 'warn',

    '@typescript-eslint/no-duplicate-imports': 'off',

    'no-restricted-imports': [
      'error',
      {
        paths: [
          './.generated/latest/types',
          '../../.generated/latest/types',
          '../../../.generated/latest/types',
          '../../../../.generated/latest/types',
          '../../../../../.generated/latest/types',
          './algorithms/types/restricted/ScenarioDatumInternal',
          '../algorithms/types/restricted/ScenarioDatumInternal',
          '../../algorithms/types/restricted/ScenarioDatumInternal',
          '../../../algorithms/types/restricted/ScenarioDatumInternal',
          '../../../../algorithms/types/restricted/ScenarioDatumInternal',
        ].map((name) => ({
          name,
          message: `Reason: please don't import generated or restricted types directly, import adjusted types from 'src/algorithms/types/*.types.ts' instead`,
        })),
      },
    ],
  },
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  settings: {
    'react': {
      version: 'detect',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.js', '.jsx', '.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  overrides: [
    // FIXME: These files are to be fixed and these ignores are to be removed
    // begin
    {
      files: [
        'src/algorithms/model.ts', // FIXME
        'src/algorithms/results.ts', // FIXME
        'src/components/Main/Results/AgeBarChart.tsx', // FIXME
        'src/components/Main/Results/DeterministicLinePlot.tsx', // FIXME
        'src/components/Main/Results/Utils.ts', // FIXME
      ],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/restrict-plus-operands': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
      },
    },
    // end
    {
      files: ['*.d.ts'],
      rules: {
        '@typescript-eslint/ban-types': ['warn', { extendDefaults: true, types: { object: false } }],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-useless-constructor': 'off',
        'react/prefer-stateless-function': 'off',
      },
    },
    {
      files: [
        '.eslintrc.js',
        'babel.config.js',
        'config/**/*.js',
        'config/**/*.ts',
        'config/jest/mocks/**/*.js',
        'infra/**/*.js',
        'jest-runner-eslint.config.js',
        'jest.config.js',
        'lib/EnvVarError.js',
        'lib/findModuleRoot.js',
        'lib/getenv.js',
        'next.config.js',
        'postcss.config.js',
        'stylelint.config.js',
        'webpack.config.js',
      ],
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        'global-require': 'off',
        'security/detect-child-process': 'off',
        'sonarjs/cognitive-complexity': ['warn', 50],
      },
    },
    {
      files: ['src/components/**', 'src/pages/**'],
      rules: {
        'i18next/no-literal-string': [
          'off',
          {
            ignoreCallee: ['t'],
            ignoreAttribute: ['url', 'key', 'identifier'],
          },
        ],
      },
    },
    {
      files: ['src/helpers/polyfill*', 'src/index.polyfilled.ts', 'src/workers/algorithm/worker.polyfilled.ts'],
      rules: {
        '@typescript-eslint/no-unsafe-return': 'off',
        'global-require': 'off',
        'unicorn/import-index': 'off',
      },
    },
    {
      files: ['src/helpers/polyfill*'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-typeof-undefined': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        'global-require': 'off',
        'lodash/prefer-lodash-typecheck': 'off',
        'no-typeof-undefined': 'off',
        'unicorn/import-index': 'off',
      },
    },
    {
      files: ['src/state/store.ts'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'global-require': 'off',
        'no-underscore-dangle': 'off',
      },
    },
    {
      files: ['src/state/sagas.ts'],
      rules: {
        'no-loops/no-loops': 'off',
      },
    },
    {
      files: ['**/*.test.*', '**/__test__/**', '**/__tests__/**', '**/test/**', '**/tests/**'],
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        'i18next/no-literal-string': 'off',
        'sonarjs/no-duplicate-string': 'off',
        'sonarjs/no-identical-functions': 'off',
      },
    },
    {
      files: ['cypress/**'],
      env: {
        'cypress/globals': true,
      },
      plugins: ['cypress'],
      rules: {
        'cypress/assertion-before-screenshot': 'warn',
        'cypress/no-assigning-return-values': 'warn',
        'cypress/no-force': 'warn',
        'cypress/no-unnecessary-waiting': 'warn',
        'jest/consistent-test-it': 'off',
        'jest/expect-expect': 'off',
        'sonarjs/no-duplicate-string': 'off',
        'sonarjs/no-identical-functions': 'off',
        'spaced-comment': 'off',
      },
    },
    {
      files: [
        '**/__tests__/*.reducer.*',
        '**/__tests__/*.reducers.*',
        '**/*.reducer.test.*',
        '**/*.reducers.test.*',
        '**/__tests__/*.saga.*',
        '**/__tests__/*.sagas.*',
        '**/*.saga.test.*',
        '**/*.sagas.test.*',
      ],
      rules: {
        'jest/expect-expect': 'off',
      },
    },
    {
      files: ['src/algorithms/**/*.{js,ts}'],
      rules: {
        'no-loops/no-loops': 'off',
        'no-plusplus': 'off',
        'sonarjs/cognitive-complexity': 'off',
      },
    },
  ],
}
