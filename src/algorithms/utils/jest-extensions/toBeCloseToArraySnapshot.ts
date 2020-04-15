import type { Context } from './types'
import State from './state'

function serialize(arr: number[]) {
  const bytesPer = Float64Array.BYTES_PER_ELEMENT
  const buffer = Buffer.alloc(arr.length * bytesPer)
  for (const [i, element] of arr.entries()) {
    buffer.writeDoubleLE(element, i * bytesPer)
  }
  return buffer.toString('base64')
}

/* This function will throw an exception if param is not defined. */
function deserialize(str: string) {
  const bytesPer = Float64Array.BYTES_PER_ELEMENT
  const buffer = Buffer.from(str, 'base64')
  const result = []
  for (let i = 0; i < buffer.length; i += bytesPer) {
    result.push(buffer.readDoubleLE(i))
  }

  return result
}

/* Catch failed deserialization and return an empty array to force a new snapshot */
function tryDeserialize(str: string) {
  try {
    return deserialize(str)
  } catch {
    return []
  }
}

function bigIntRep(num: number): bigint {
  const buffer = new ArrayBuffer(Float64Array.BYTES_PER_ELEMENT)
  const view = new DataView(buffer)
  view.setFloat64(0, num, true)
  return view.getBigInt64(0, true)
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
    let diff = bigIntRep(want) - bigIntRep(got)
    if (diff < 0n) {
      diff *= -1n
    }
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
