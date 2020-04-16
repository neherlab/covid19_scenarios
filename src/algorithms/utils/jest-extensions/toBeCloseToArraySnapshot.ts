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

function compare(
  expected: number[],
  received: number[],
  maxUlp: bigint,
): { pass: boolean; diffs?: { want: number; got: number; diff: bigint }[] } {
  if (expected === undefined) {
    return { pass: false }
  }

  const diffs = received.map((_, idx) => {
    const want = expected[idx]
    const got = received[idx]
    const diff = absUlpDiff(want, got)
    return { want, got, diff }
  })

  const failed = diffs.filter(({ diff }) => diff >= maxUlp)
  const pass = failed.length === 0

  return { pass, diffs }
}

export default function toBeCloseToArraySnapshot(this: Context, received: number[], maxUlp: bigint) {
  const state = new State(this)

  const snapshot = state.getSnapshot()
  const expected = tryDeserialize(snapshot)

  const { pass } = compare(expected, received, maxUlp)

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
