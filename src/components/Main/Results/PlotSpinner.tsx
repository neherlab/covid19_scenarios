import React from 'react'

import Loader from 'react-loader-spinner'
import { connect } from 'react-redux'

import { selectIsRunning } from '../../../state/algorithm/algorithm.selectors'
import { State } from '../../../state/reducer'

export interface RunningSpinerProps {
  size: number
}

export function RunningSpinner({ size }: RunningSpinerProps) {
  return <Loader type="ThreeDots" color="#495057" height={size} width={size} />
}

export interface PlotSpinnerProps {
  isRunning: boolean
  size: number
}

const mapStateToProps = (state: State) => ({
  isRunning: selectIsRunning(state),
})

const mapDispatchToProps = {}

export const PlotSpinner = connect(mapStateToProps, mapDispatchToProps)(PlotSpinnerDisconnected)

export function PlotSpinnerDisconnected({ isRunning, size = 75 }: PlotSpinnerProps) {
  if (!isRunning) {
    return null
  }

  return (
    <div className="spinner-container">
      <RunningSpinner size={size} />
    </div>
  )
}
