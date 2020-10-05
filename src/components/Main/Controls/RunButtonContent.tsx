import React from 'react'

import type { TFunction } from 'i18next'
import { MdPlayArrow, MdRefresh } from 'react-icons/md'
import Loader from 'react-loader-spinner'
import { useTranslation } from 'react-i18next'

export interface RunningSpinerProps {
  size: number
}

export function RunningSpinner({ size }: RunningSpinerProps) {
  return <Loader type="ThreeDots" color="white" height={size} width={size} />
}

export type ButtonStateName = 'normalIdling' | 'normalRunning' | 'autorunIdling' | 'autorunRunning'

export interface ButtonState {
  Icon: React.ElementType
  text: string
}

export function getStates(t: TFunction): Record<ButtonStateName, ButtonState> {
  return {
    normalIdling: {
      Icon: MdPlayArrow,
      text: t(`Run`),
    },
    normalRunning: {
      Icon: RunningSpinner,
      text: t(`Running...`),
    },
    autorunIdling: {
      Icon: MdRefresh,
      text: t(`Refresh`),
    },
    autorunRunning: {
      Icon: RunningSpinner,
      text: t(`Refreshing...`),
    },
  }
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
  const { t } = useTranslation()
  const states = getStates(t)

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
