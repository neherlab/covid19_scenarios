/* eslint-disable */
import * as fs from 'fs'
const { utils } = require('jest-snapshot')

function extractContext(context: any) {
  const { currentTestName: testName, snapshotState: state } = context
  state._counters.set(testName, (state._counters.get(testName) || 0) + 1)
  const count = Number(state._counters.get(testName))
  const key = utils.testNameToKey(testName, count)

  return { testName, state, count, key }
}

function getExpectedSnapshot(state: any, key: string) {
  const data = state._snapshotData[key]

  if (!data) {
    return []
  }

  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

function toBeCloseToArraySnapshot(this: any, received: number[]) {
  const { testName, state, count, key } = extractContext(this)

  /* If this isn't done, Jest reports the test as 'obsolete' and prompts for deletion. */
  state.markSnapshotsAsCheckedForTest(testName)

  const expected = getExpectedSnapshot(state, key)
  const tolerance = 10 ** -2 / 2

  const diffs = received.map((_, idx) => {
    const want = expected[idx]
    const got = received[idx]
    const diff = Math.abs(want - got)
    return { want, got, diff }
  })

  const pass = diffs.filter(({ diff }) => diff >= tolerance).length === 0
  const hasSnapshot = expected !== undefined
  const snapshotIsPersisted = fs.existsSync(state._snapshotPath)
  const receivedSerialized = JSON.stringify(received, null, 2)

  if (pass) {
    /* Test passed, now update the snapshot state with the serialize snapshot.
     * Technically this is only necessary if no snapshot was saved before. */
    state._snapshotData[key] = receivedSerialized
  }

  /* This nested mess is derived the Jest snapshot matcher code:
   * https://github.com/facebook/jest/blob/4a59daa8715bde6a1b085ff7f4140f3a337045aa/packages/jest-snapshot/src/State.ts
   */
  if (
    (hasSnapshot && state._updateSnapshot === 'all') ||
    ((!hasSnapshot || !snapshotIsPersisted) && (state._updateSnapshot === 'new' || state._updateSnapshot === 'all'))
  ) {
    if (state._updateSnapshot === 'all') {
      if (!pass) {
        if (hasSnapshot) {
          state.updated++
        } else {
          state.added++
        }
        state._addSnapshot(key, receivedSerialized, { error: undefined, isInline: false })
      } else {
        state.matched++
      }
    } else {
      state._addSnapshot(key, receivedSerialized, { error: undefined, isInline: false })
      state.added++
    }

    return {
      message: () => 'message a',
      actual: '',
      count,
      expected: '',
      key,
      pass: true,
    }
  } else {
    if (!pass) {
      state.unmatched++
      return {
        message: () => 'message b',
        actual: receivedSerialized,
        count,
        expected: expected !== undefined ? expected : undefined,
        key,
        pass: false,
      }
    } else {
      state.matched++
      return {
        message: () => 'message c',
        actual: receivedSerialized,
        count,
        expected: '',
        key,
        pass: true,
      }
    }
  }
}

export { toBeCloseToArraySnapshot }
