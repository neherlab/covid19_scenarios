/* eslint-disable no-underscore-dangle */
/* Because Jest StateSnapshot uses them. */

/* eslint-disable no-param-reassign */
/* Because the convention in Jest's toMatchSnapshot() is to modify state. */

/* eslint-disable import/no-extraneous-dependencies */
/* tslint:disable:no-implicit-dependencies */
/* Because this is a Jest extension, and these imports are present. :/ */

import * as fs from 'fs'
import { MatcherState } from 'expect'
import { utils } from 'jest-snapshot'

/* This interface is made to match https://github.com/facebook/jest/blob/4a59daa8715bde6a1b085ff7f4140f3a337045aa/packages/jest-snapshot/src/State.ts#L54
 */
interface SnapshotState {
  _counters: Map<string, number>
  _updateSnapshot: 'new' | 'all' | 'none'
  _snapshotData: Record<string, string>
  _snapshotPath: string
  markSnapshotsAsCheckedForTest: (testName: string) => void
  _addSnapshot: (key: string, receivedSerialized: string, options: { isInline: boolean; error?: Error }) => void
  updated: number
  added: number
  unmatched: number
  matched: number
}

/* This interface is made to match https://github.com/facebook/jest/blob/4a59daa8715bde6a1b085ff7f4140f3a337045aa/packages/jest-snapshot/src/types.ts#L11
 */
interface Context extends MatcherState {
  snapshotState: SnapshotState
  currentTestName: string
}

function getContext(context: Context) {
  const { currentTestName: testName, snapshotState: state, error } = context

  state._counters.set(testName, (state._counters.get(testName) || 0) + 1)

  const count = Number(state._counters.get(testName))
  const key = utils.testNameToKey(testName, count)

  return { testName, state, count, key, error }
}

function getSnapshot(state: SnapshotState, key: string) {
  const data = state._snapshotData[key]

  if (!data) {
    return undefined
  }

  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

function serialize(data: number[]): string {
  return JSON.stringify(data, null, 2)
}

function setSnapshot(state: SnapshotState, key: string, expected: number[]) {
  state._snapshotData[key] = serialize(expected)
}

function compare(
  expected: number[],
  received: number[],
  tolerance: number,
): { pass: boolean; diffs?: { want: number; got: number; diff: number }[] } {
  if (expected === undefined) {
    return { pass: false }
  }

  const diffs = received.map((_, idx) => {
    const want = expected[idx]
    const got = received[idx]
    const diff = Math.abs(want - got)
    return { want, got, diff }
  })

  const pass = diffs.filter(({ diff }) => diff >= tolerance).length === 0

  return { pass, diffs }
}

/* This nested mess is derived the Jest snapshot matcher code:
 * https://github.com/facebook/jest/blob/4a59daa8715bde6a1b085ff7f4140f3a337045aa/packages/jest-snapshot/src/State.ts
 */
function couldAddSnapshot(state: SnapshotState, hasSnapshot: boolean): boolean {
  const snapshotIsPersisted = fs.existsSync(state._snapshotPath)

  return (
    (hasSnapshot && state._updateSnapshot === 'all') ||
    ((!hasSnapshot || !snapshotIsPersisted) && (state._updateSnapshot === 'new' || state._updateSnapshot === 'all'))
  )
}

function maybeAddSnapshot(
  state: SnapshotState,
  key: string,
  hasSnapshot: boolean,
  received: number[],
  pass: boolean,
  error?: Error,
) {
  const isInline = false

  if (state._updateSnapshot === 'all') {
    if (!pass) {
      if (hasSnapshot) {
        state.updated++
      } else {
        state.added++
      }
      state._addSnapshot(key, serialize(received), { error, isInline })
    } else {
      state.matched++
    }
  } else {
    state._addSnapshot(key, serialize(received), { error, isInline })
    state.added++
  }
}

function toBeCloseToArraySnapshot(this: Context, received: number[], precision: 2) {
  const { testName, state, count, key, error } = getContext(this)

  /* If this isn't done, Jest reports the test as 'obsolete' and prompts for deletion. */
  state.markSnapshotsAsCheckedForTest(testName)

  const expected = getSnapshot(state, key)

  const tolerance = Math.pow(10, -precision) / 2
  const { pass } = compare(expected, received, tolerance)

  if (pass) {
    setSnapshot(state, key, received)
  }

  const hasSnapshot = expected !== undefined

  if (couldAddSnapshot(state, hasSnapshot)) {
    maybeAddSnapshot(state, key, hasSnapshot, received, pass, error)

    return {
      message: () => '',
      pass: true,
    }
  } else {
    if (!pass) {
      state.unmatched++
      return {
        message: () => `expected: ${serialize(received)}\n received: ${serialize(expected)}`,
        actual: serialize(received),
        count,
        expected: expected !== undefined ? serialize(expected) : undefined,
        key,
        pass: false,
      }
    } else {
      state.matched++
      return {
        message: () => 'message c',
        actual: serialize(received),
        count,
        expected: '',
        key,
        pass: true,
      }
    }
  }
}

export { toBeCloseToArraySnapshot }
