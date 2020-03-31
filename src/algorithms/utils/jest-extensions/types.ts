import { MatcherState } from 'expect'

/* SnapshotState interface is made to match https://github.com/facebook/jest/blob/4a59daa8715bde6a1b085ff7f4140f3a337045aa/packages/jest-snapshot/src/State.ts#L54
 */
export interface SnapshotState {
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

/* Context interface is made to match https://github.com/facebook/jest/blob/4a59daa8715bde6a1b085ff7f4140f3a337045aa/packages/jest-snapshot/src/types.ts#L11
 */
export interface Context extends MatcherState {
  snapshotState: SnapshotState
  currentTestName: string
}
