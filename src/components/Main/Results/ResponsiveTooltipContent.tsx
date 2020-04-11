import React, { ReactNode } from 'react'

import './ResponsiveTooltipContent.scss'

interface TooltipItem {
  name: string
  value: string | number | [number, number] | ReactNode
  lower?: string | number | ReactNode
  upper?: string | number | ReactNode
  color: string
}

interface TooltipContentProps {
  active: boolean
  label?: string | number
  payload: TooltipItem[]
  formatter?: Function
  labelFormatter?: Function
}

function ToolTipContentItem({ name, value, lower, upper, color }: TooltipItem) {
  if (lower && upper) {
    return (
      <div style={{ color }} className="responsive-tooltip-content-item">
        {name}
        <div className="responsive-tooltip-content-placeholder" />
        <div>
          {value}{' '}
          <div style={{ display: 'inline-block' }}>
            <span style={{ display: 'inline-block' }}>
              <sup style={{ display: 'block', position: 'relative' }}>+{upper}</sup>
              <sub style={{ display: 'block', position: 'relative' }}>-{lower}</sub>
            </span>
          </div>
        </div>
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

  const uncertainty: Record<string, [number, number]> = {}
  payload.forEach((item) => {
    if (item.name && item.name.includes(' uncertainty')) {
      const key = item.name.replace(' uncertainty', '')
      uncertainty[key] = [item.value[0], item.value[1]]
    }
  })

  const essentialPayload = payload
    .map((payloadItem) => ({
      name: payloadItem.name,
      color: payloadItem.color || '#bbbbbb',
      value: formatter ? formatNumber(payloadItem.value, '', '', 0) : payloadItem.value,
      lower:
        payloadItem.name in uncertainty
          ? formatNumber(payloadItem.value - uncertainty[payloadItem.name][0], '', '', 0)
          : undefined,
      upper:
        payloadItem.name in uncertainty
          ? formatNumber(uncertainty[payloadItem.name][1] - payloadItem.value, '', '', 0)
          : undefined,
    }))
    .filter((payloadItem) => (payloadItem.name ? !payloadItem.name.includes('uncertainty') : true))

  const left = payload.length > 1 ? essentialPayload.slice(0, Math.floor(payload.length / 2)) : payload
  const right = payload.length > 1 ? essentialPayload.slice(Math.floor(payload.length / 2), payload.length - 1) : []

  if (active) {
    return (
      <div className="responsive-tooltip-content-base">
        <strong>{formattedLabel}</strong>
        <div className="responsive-tooltip-content">
          <div>
            {left.map((item, idx) => (
              <ToolTipContentItem
                key={idx}
                name={item.name}
                value={item.value}
                lower={item.lower}
                upper={item.upper}
                color={item.color}
              />
            ))}
          </div>
          <div>
            {right.map((item, idx) => (
              <ToolTipContentItem
                key={idx}
                name={item.name}
                value={item.value}
                lower={item.lower}
                upper={item.upper}
                color={item.color}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return null
}
