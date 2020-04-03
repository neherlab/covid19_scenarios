import React, { ReactNode } from 'react'

import './ResponsiveTooltipContent.scss'

interface TooltipItem {
  name: string
  value: string | number | ReactNode
  error?: string | number | ReactNode
  color: string
}

interface TooltipContentProps {
  active: boolean
  label?: string | number
  payload: TooltipItem[]
  formatter?: Function
  labelFormatter?: Function
}

function ToolTipContentItem({ name, value, error, color }: TooltipItem) {
  if (error) {
    return (
      <div style={{ color }} className="responsive-tooltip-content-item">
        {name}
        <div className="responsive-tooltip-content-placeholder" />
        {value} ± {error}
      </div>
    )
  } else {
    return (
      <div style={{ color }} className="responsive-tooltip-content-item">
        {name}
        <div className="responsive-tooltip-content-placeholder" />
        {value}
      </div>
    )
  }
}

export function ResponsiveTooltipContent({ active, payload, label, formatter, labelFormatter }: TooltipContentProps) {
  const formattedLabel = labelFormatter && label ? labelFormatter(label) : label
  const formatNumber = formatter

  const uncertainty: Record<string, number> = {}
  payload.forEach((item) => {
    if (item.name && item.name.includes(' uncertainty')) {
      const key = item.name.replace(' uncertainty', '')
      uncertainty[key] = (item.value[1] - item.value[0]) / 2.0
    }
  })

  const essentialPayload = payload
    .map((payloadItem) => ({
      name: payloadItem.name,
      color: payloadItem.color || '#bbbbbb',
      value: formatNumber ? formatNumber(payloadItem.value, '', '', 0) : payloadItem.value,
      error: payloadItem.name in uncertainty ? formatNumber(uncertainty[payloadItem.name], '', '', 0) : undefined,
    }))
    .filter((payloadItem) => (payloadItem ? !payloadItem.name.includes('uncertainty') : true))

  const left = payload.length > 1 ? essentialPayload.slice(0, Math.floor(payload.length / 2)) : payload
  const right = payload.length > 1 ? essentialPayload.slice(Math.floor(payload.length / 2), payload.length - 1) : []

  if (active) {
    return (
      <div className="responsive-tooltip-content-base">
        <strong>{formattedLabel}</strong>
        <div className="responsive-tooltip-content">
          <div>
            {left.map((item, idx) => (
              <ToolTipContentItem key={idx} name={item.name} value={item.value} error={item.error} color={item.color} />
            ))}
          </div>
          <div>
            {right.map((item, idx) => (
              <ToolTipContentItem key={idx} name={item.name} value={item.value} error={item.error} color={item.color} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return null
}
