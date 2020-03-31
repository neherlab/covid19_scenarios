/* eslint-disable no-param-reassign */
/* Because the convention in Jest's toMatchSnapshot() is to modify state. */

/* eslint-disable import/no-extraneous-dependencies */
/* tslint:disable:no-implicit-dependencies */
/* Because this is a Jest extension, and these imports are present. :/ */

import type { Context } from './types'
import State from './state'

function serialize(data: number[]): string {
  return JSON.stringify(data, null, 2)
}

function deserialize(data: string): number[] {
  try {
    return JSON.parse(data)
  } catch {
    return []
  }
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

export default function toBeCloseToArraySnapshot(this: Context, received: number[], precision: 2) {
  const state = new State(this)

  const snapshot = state.getSnapshot()
  const expected = deserialize(snapshot)

  const tolerance = Math.pow(10, -precision) / 2
  const { pass } = compare(expected, received, tolerance)

  if (pass) {
    state.setSnapshot(serialize(received))
  }

  state.markSnapshotsAsCheckedForTest()
  state.updateTally(pass)

  if (state.couldAddSnapshot()) {
    state.addSnapshot(serialize(received))

    return {
      message: () => '',
      pass: true,
    }
  }

  if (!pass) {
    return {
      message: () => `expected: ${serialize(received)}\n received: ${serialize(expected)}`,
      actual: serialize(received),
      count: state.count,
      expected: expected !== undefined ? serialize(expected) : undefined,
      key: state.key,
      pass: false,
    }
  }

  return {
    message: () => 'message c',
    actual: serialize(received),
    count: state.count,
    expected: '',
    key: state.key,
    pass: true,
  }
}
