import React from 'react'

import i18next from 'i18next'
import Loader from 'react-loader-spinner'

export interface RunningSpinerProps {
  size: number
}

export function RunningSpinner({ size }: RunningSpinerProps) {
  return <Loader type="ThreeDots" color="#495057" height={size} width={size} />
}

export interface PlotState {
  Icon: React.ElementType
  text: string
}

const states: Record<'normalRunning' | 'autorunRunning', PlotState> = {
  normalRunning: {
    Icon: RunningSpinner,
    text: i18next.t(`Running...`),
  },
  autorunRunning: {
    Icon: RunningSpinner,
    text: i18next.t(`Refreshing...`),
  },
}

export function PlotSpinnerConcrete({ state, size }: { state: PlotState; size: number }) {
  const { Icon } = state

  return (
    <div className="spinner-container">
      <Icon size={size} />
    </div>
  )
}

export interface PlotSpinnerProps {
  isAutorunEnabled: boolean
  isRunning: boolean
  size: number
}

export function PlotSpinner({ isRunning, isAutorunEnabled, size = 75 }: PlotSpinnerProps) {
  let state = states.normalRunning
  if (isAutorunEnabled && isRunning) {
    state = states.autorunRunning
  } else if (!isRunning) {
    return null
  }

  return <PlotSpinnerConcrete state={state} size={size} />
}
