import React from 'react'

import { useTranslation } from 'react-i18next'
import { MdPlayArrow, MdRefresh } from 'react-icons/md'
import Loader from 'react-loader-spinner'

export interface RunningSpinerProps {
  size: number
}

export function RunningSpinner({ size }: RunningSpinerProps) {
  return <Loader type="ThreeDots" color="white" height={size} width={size} />
}

export interface RunButtonContentProps {
  isRunning: boolean
  isAutorunEnabled: boolean
  size: number
}

export function RunButtonContent({ isRunning, isAutorunEnabled, size = 35 }: RunButtonContentProps) {
  const { t } = useTranslation()

  if (isRunning) {
    return (
      <>
        <RunningSpinner size={size} />
        <div>{t(`Running...`)}</div>
      </>
    )
  }

  if (isRunning) {
    return (
      <>
        <MdRefresh size={size} />
        <div>{t(`Refresh`)}</div>
      </>
    )
  }

  return (
    <>
      <MdPlayArrow size={size} />
      <div>{t(`Run`)}</div>
    </>
  )
}
