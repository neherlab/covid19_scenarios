import React from 'react'
import './ResponsiveTooltipContent.scss'

interface TooltipItem {
  name: string
  value: string | number
  color: string
}

interface TooltipContentProps {
  active: boolean
  payload: TooltipItem[]
} 

function ToolTipContentItem({ name, value, color}: TooltipItem) {
  return (
    <div style={{ color }} className="responsive-tooltip-content-item">
      {name}
      <div className="responsive-tooltip-content-placeholder" />
      {value}
    </div>
  )
}

export function ResponsiveTooltipContent({ active, payload }: TooltipContentProps) {
  const essentialPayload = payload.map(payloadItem => ({
    name: payloadItem.name,
    color: payloadItem.color || '#bbbbbb',
    value: payloadItem.value
  }))

  const left = payload.length > 1 ? essentialPayload.slice(0, Math.floor(payload.length / 2)) : payload
  const right = payload.length > 1 ? essentialPayload.slice(Math.floor(payload.length / 2), payload.length - 1) : []

  if (active) {
    return (
        <div className="responsive-tooltip-content">
          <div>
            {left.map((item, idx) => <ToolTipContentItem key={idx} name={item.name} value={item.value} color={item.color} />)}
          </div>
          <div>
            {right.map((item, idx) => <ToolTipContentItem key={idx} name={item.name} value={item.value} color={item.color} />)}
          </div>
        </div>
    )
  }

  return null
}