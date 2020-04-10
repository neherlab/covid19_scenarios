import React from 'react'
import { TooltipProps } from 'recharts'

import { colors } from './ChartCommon'
import { ResponsiveTooltipContent, TooltipItem } from './ResponsiveTooltipContent'

import './ResponsiveTooltipContent.scss'

export interface ChartTooltipProps extends TooltipProps {
  valueFormatter: (value: number | string) => string
}

export function ChartTooltip({ active, payload, label, valueFormatter, labelFormatter }: ChartTooltipProps) {
  if (!active || !label || !payload) {
    return null
  }

  const formattedLabel = labelFormatter && label !== undefined ? labelFormatter(label) : label

  const tooltipItems = payload.map(
    (payloadItem): TooltipItem => {
      const value = payloadItem && payloadItem.value !== undefined ? (payloadItem.value as string | number) : 0

      return {
        name: payloadItem.name,
        color:
          payloadItem.color ||
          ((payloadItem.dataKey as string) in colors ? colors[payloadItem.dataKey as string] : '#bbbbbb'),
        key: (payloadItem.dataKey as string) || payloadItem.name,
        value: valueFormatter ? valueFormatter(value) : value,
      }
    },
  )

  return <ResponsiveTooltipContent formattedLabel={formattedLabel} tooltipItems={tooltipItems} />
}
