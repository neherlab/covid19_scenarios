/* eslint-disable no-underscore-dangle */
/* Because Jest StateSnapshot uses them. */

/* eslint-disable import/no-extraneous-dependencies */
/* tslint:disable:no-implicit-dependencies */
/* Because this is Jest extension, and Jest is present. */

import * as fs from 'fs'
import { utils } from 'jest-snapshot'
import type { Context, SnapshotState } from './types'

export default class State {
  private currentTestName: string
  private snapshotState: SnapshotState
  private error?: Error
  private hasSnapshot: boolean

  private incrementCounters() {
    this.snapshotState._counters.set(
      this.currentTestName,
      (this.snapshotState._counters.get(this.currentTestName) || 0) + 1,
    )
  }

  get count() {
    return Number(this.snapshotState._counters.get(this.currentTestName))
  }

  get key() {
    return utils.testNameToKey(this.currentTestName, this.count)
  }

  markSnapshotsAsCheckedForTest() {
    this.snapshotState.markSnapshotsAsCheckedForTest(this.currentTestName)
  }

  get snapshotIsPersisted() {
    return fs.existsSync(this.snapshotState._snapshotPath)
  }

  constructor(context: Context) {
    this.currentTestName = context.currentTestName
    this.snapshotState = context.snapshotState
    this.error = context.error

    this.incrementCounters()

    this.hasSnapshot = this.getSnapshot() !== undefined
  }

  getSnapshot() {
    return this.snapshotState._snapshotData[this.key]
  }

  setSnapshot(data: string) {
    this.snapshotState._snapshotData[this.key] = data
  }

  /* This nested mess is derived the Jest snapshot matcher code:
   * https://github.com/facebook/jest/blob/4a59daa8715bde6a1b085ff7f4140f3a337045aa/packages/jest-snapshot/src/State.ts
   *
   * Which describes the conditions as follows:
   *  These are the conditions on when to write snapshots:
   * There's no snapshot file in a non-CI environment.
   * There is a snapshot file and we decided to update the snapshot.
   * There is a snapshot file, but it doesn't have this snaphsot.
   These are the conditions on when not to write snapshots:
   * The update flag is set to 'none'.
   * There's no snapshot file or a file without this snapshot on a CI environment.
   */
  couldAddSnapshot(): boolean {
    return (
      (this.hasSnapshot && this.snapshotState._updateSnapshot === 'all') ||
      ((!this.hasSnapshot || !this.snapshotIsPersisted) &&
        (this.snapshotState._updateSnapshot === 'new' || this.snapshotState._updateSnapshot === 'all'))
    )
  }

  updateTally(pass: boolean) {
    if (this.couldAddSnapshot()) {
      if (this.snapshotState._updateSnapshot === 'all') {
        if (!pass) {
          if (this.hasSnapshot) {
            this.snapshotState.updated++
          } else {
            this.snapshotState.added++
          }
        } else {
          this.snapshotState.matched++
        }
      } else {
        this.snapshotState.added++
      }
    } else if (!pass) {
      this.snapshotState.unmatched++
    } else {
      this.snapshotState.matched++
    }
  }

  addSnapshot(data: string) {
    const isInline = false

    this.snapshotState._addSnapshot(this.key, data, { error: this.error, isInline })
  }
}
