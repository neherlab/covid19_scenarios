import React from 'react'

import i18next from 'i18next'
import { MdPlayArrow, MdRefresh } from 'react-icons/md'
import Loader from 'react-loader-spinner'

export interface RunningSpinerProps {
  size: number
}

export function RunningSpinner({ size }: RunningSpinerProps) {
  return <Loader type="ThreeDots" color="white" height={size} width={size} />
}

export interface ButtonState {
  Icon: React.ElementType
  text: string
}

const states: Record<'normalIdling' | 'normalRunning' | 'autorunIdling' | 'autorunRunning', ButtonState> = {
  normalIdling: {
    Icon: MdPlayArrow,
    text: i18next.t(`Run`),
  },
  normalRunning: {
    Icon: RunningSpinner,
    text: i18next.t(`Running...`),
  },
  autorunIdling: {
    Icon: MdRefresh,
    text: i18next.t(`Refresh`),
  },
  autorunRunning: {
    Icon: RunningSpinner,
    text: i18next.t(`Refreshing...`),
  },
}

export function RunButtonContentConcrete({ state, size }: { state: ButtonState; size: number }) {
  const { Icon } = state

  return <Icon size={size} />
}

export interface RunButtonContentProps {
  isRunning: boolean
  isAutorunEnabled: boolean
  size: number
}

export function RunButtonContent({ isRunning, isAutorunEnabled, size = 35 }: RunButtonContentProps) {
  let state = states.autorunIdling
  if (isAutorunEnabled && isRunning) {
    state = states.autorunRunning
  } else if (!isAutorunEnabled && !isRunning) {
    state = states.normalIdling
  } else if (!isAutorunEnabled && isRunning) {
    state = states.normalRunning
  }

  return <RunButtonContentConcrete state={state} size={size} />
}
