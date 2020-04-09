import React, { ReactNode } from 'react'
import { TooltipProps } from 'recharts'
import './ResponsiveTooltipContent.scss'

export function ResponsiveTooltipContent({ active, payload, label, formatter, labelFormatter }: TooltipProps) {
  if (!active || !label || !payload || payload.length <= 2) {
    return null
  }

  const formattedLabel = labelFormatter && label !== undefined ? labelFormatter(label) : '-'

  const formattedPayload = payload.map((item, idx) => ({
    name: item.name,
    color: item.color || '#bbbbbb',
    value: formatter ? formatter(item.value as string | number, item.name, item, idx) : item.value,
  }))

  const left = payload.length > 1 ? formattedPayload.slice(0, Math.floor(payload.length / 2)) : formattedPayload
  const right = payload.length > 1 ? formattedPayload.slice(Math.floor(payload.length / 2), payload.length - 1) : []

  return (
    <div className="responsive-tooltip-content-base">
      <strong>{formattedLabel}</strong>
      <div className="responsive-tooltip-content">
        <div>
          {left.map((item) => (
            <ToolTipContentItem key={item.name} name={item.name} value={item.value} color={item.color} />
          ))}
        </div>
        <div>
          {right.map((item) => (
            <ToolTipContentItem key={item.name} name={item.name} value={item.value} color={item.color} />
          ))}
        </div>
      </div>
    </div>
  )
}

interface TooltipItem {
  name: string
  value: string | number | ReactNode
  color: string
}

function ToolTipContentItem({ name, value, color }: TooltipItem) {
  return (
    <div style={{ color }} className="responsive-tooltip-content-item">
      {name}
      <div className="responsive-tooltip-content-placeholder" />
      {value}
    </div>
  )
}
