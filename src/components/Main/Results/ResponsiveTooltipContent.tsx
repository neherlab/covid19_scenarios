import React, { ReactNode } from 'react'
import { TooltipFormatter, LabelFormatter } from 'recharts'
import './ResponsiveTooltipContent.scss'

interface TooltipItem {
  name: string
  value: string | number | ReactNode
  color: string
}

interface TooltipContentProps {
  active: boolean
  label?: string | number
  payload: TooltipItem[]
  formatter?: TooltipFormatter
  labelFormatter?: LabelFormatter
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

export function ResponsiveTooltipContent({ active, payload, label, formatter, labelFormatter }: TooltipContentProps) {
  const formattedLabel = labelFormatter && label ? labelFormatter(label) : label
  const formatNumber = formatter

  const essentialPayload = payload.map((payloadItem) => ({
    name: payloadItem.name,
    color: payloadItem.color || '#bbbbbb',
    value: formatter ? formatNumber(payloadItem.value, '', '', 0) : payloadItem.value,
  }))

  const left = payload.length > 1 ? essentialPayload.slice(0, Math.floor(payload.length / 2)) : payload
  const right = payload.length > 1 ? essentialPayload.slice(Math.floor(payload.length / 2), payload.length - 1) : []

  if (active) {
    return (
      <div className="responsive-tooltip-content-base">
        <strong>{formattedLabel}</strong>
        <div className="responsive-tooltip-content">
          <div>
            {left.map((item, idx) => (
              <ToolTipContentItem key={idx} name={item.name} value={item.value} color={item.color} />
            ))}
          </div>
          <div>
            {right.map((item, idx) => (
              <ToolTipContentItem key={idx} name={item.name} value={item.value} color={item.color} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return null
}
