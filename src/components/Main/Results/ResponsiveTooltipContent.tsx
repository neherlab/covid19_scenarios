import React, { ReactNode } from 'react'
import { TooltipProps } from 'recharts'

import { LineProps } from './ChartCommon'

import './ResponsiveTooltipContent.scss'

export interface TooltipItem extends LineProps {
  value: React.ReactNode
}

export interface ResponsiveTooltipContentProps extends TooltipProps {
  formattedLabel: React.ReactNode
  tooltipItems: TooltipItem[]
}

export function ResponsiveTooltipContent({ formattedLabel, tooltipItems }: ResponsiveTooltipContentProps) {
  const left = tooltipItems.slice(0, Math.ceil(tooltipItems.length / 2))
  const right = tooltipItems.slice(Math.ceil(tooltipItems.length / 2))

  return (
    <div className="responsive-tooltip-content-base">
      <strong>{formattedLabel}</strong>
      <div className="responsive-tooltip-content">
        <div>
          {left.map((item) => (
            <TooltipContentItem key={item.key} name={item.name} value={item.value} color={item.color} />
          ))}
        </div>
        <div>
          {right.map((item) => (
            <TooltipContentItem key={item.key} name={item.name} value={item.value} color={item.color} />
          ))}
        </div>
      </div>
    </div>
  )
}

interface TooltipContentItemProps {
  name: string
  value: string | number | ReactNode
  color: string
}

function TooltipContentItem({ name, value, color }: TooltipContentItemProps) {
  return (
    <div style={{ color }} className="responsive-tooltip-content-item">
      {name}
      <div className="responsive-tooltip-content-placeholder" />
      {value}
    </div>
  )
}
