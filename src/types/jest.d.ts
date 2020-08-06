// This file provides type information patches for jest testing environment
// because tsc and IDEs cannot deduce types from jest config file alone.
// Order of imports is important!

import '@testing-library/jest-dom/extend-expect'

import 'jest-axe'

import 'jest-extended/types'

import 'jest-styled-components'

import 'jest-chain'

declare global {
  namespace jest {
    interface Matchers<R> {
      // After toBeTruthy() we are certain that the matched value is not null.
      // Modify the return type accordingly.
      toBeTruthy(): NonNullable<R>
    }

    interface ChainedMatchers<R> {
      toBeCloseToArraySnapshot(values: number[]): R
    }
  }
}
