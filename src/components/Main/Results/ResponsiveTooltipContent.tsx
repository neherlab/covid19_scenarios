import React, { ReactNode } from 'react'

import { isNil } from 'lodash'
import { TooltipProps } from 'recharts'

import { LineProps } from './ChartCommon'

export interface TooltipItem extends LineProps {
  value: React.ReactNode
  lower?: ReactNode
  upper?: ReactNode
}

interface TooltipContentItemProps {
  name: string
  value: string | number | ReactNode
  color: string
  lower?: ReactNode
  upper?: ReactNode
}

function TooltipContentItem({ name, value, lower, upper, color }: TooltipContentItemProps) {
  if (!isNil(lower) && !isNil(upper)) {
    return (
      <div style={{ color }} className="responsive-tooltip-content-item">
        {name}
        <div className="responsive-tooltip-content-placeholder" />
        <div>
          ({lower}, <b>{value}</b>, {upper})
        </div>
      </div>
    )
  }
  return (
    <div style={{ color }} className="responsive-tooltip-content-item">
      {name}
      <div className="responsive-tooltip-content-placeholder" />
      {value}
    </div>
  )
}
export interface ResponsiveTooltipContentProps extends TooltipProps {
  formattedLabel: React.ReactNode
  tooltipItems: TooltipItem[]
}

export function ResponsiveTooltipContent({ formattedLabel, tooltipItems }: ResponsiveTooltipContentProps) {
  const left = tooltipItems.slice(0, Math.ceil(tooltipItems.length / 2))
  const right = tooltipItems.slice(Math.ceil(tooltipItems.length / 2))
  const tooltip = (item: TooltipItem) => (
    <TooltipContentItem
      key={item.key}
      name={item.name}
      value={item.value}
      lower={item.lower}
      upper={item.upper}
      color={item.color}
    />
  )
  return (
    <div className="responsive-tooltip-content-base">
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <strong>{formattedLabel}</strong>
        <div>
          {'(20%'}, <b>{'50%'}</b>, {'80%)'}{' '}
        </div>
      </div>
      <div className="responsive-tooltip-content">
        <div>{left.map((item) => tooltip(item))}</div>
        <div>{right.map((item) => tooltip(item))}</div>
      </div>
    </div>
  )
}
