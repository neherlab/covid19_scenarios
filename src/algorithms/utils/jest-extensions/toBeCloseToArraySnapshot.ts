import type { Context } from './types'
import State from './state'
import { absUlpDiff } from './comparators'

function serialize(arr: number[]): string {
  return JSON.stringify(arr)
}

/* This function will throw an exception if param is not defined. */
function deserialize(str: string): number[] {
  return JSON.parse(str)
}

/* Catch failed deserialization and return an empty array to force a new snapshot */
function tryDeserialize(str: string): number[] {
  try {
    return deserialize(str)
  } catch {
    return []
  }
}

function compare(want: number[], got: number[], maxUlp: bigint): boolean {
  if (want.length !== got.length) {
    return false
  }

  return want.every((_, idx) => absUlpDiff(want[idx], got[idx]) <= maxUlp)
}

export default function toBeCloseToArraySnapshot(this: Context, received: number[]) {
  const state = new State(this)

  const snapshot = state.getSnapshot()
  const expected = tryDeserialize(snapshot)
  const maxUlp = 1n

  const pass = compare(expected, received, maxUlp)

  state.markSnapshotsAsCheckedForTest()

  if (pass) {
    state.setSnapshot(serialize(received))
  }

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
      message: () => `expected: ${expected}\n received: ${received}`,
      actual: serialize(received),
      count: state.count,
      expected: serialize(expected),
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
