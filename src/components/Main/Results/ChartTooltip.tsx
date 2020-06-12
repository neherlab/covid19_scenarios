import React from 'react'
import { TooltipProps, TooltipPayload } from 'recharts'

import { colors } from './ChartCommon'
import { ResponsiveTooltipContent, TooltipItem } from './ResponsiveTooltipContent'

export type ValueFormatter = (value: number | string) => string

export function dispatch(key: string, item: TooltipPayload): [number | undefined, number | undefined] {
  switch (key) {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return */
    case 'peakOverflow':
      return item.payload.errorPeakOverflow
    case 'peakCritical':
      return item.payload.errorPeakCritical
    case 'peakSevere':
      return item.payload.errorPeakSevere
    case 'totalFatalities':
      return item.payload.errorFatalities
    /* eslint-enable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return */
    default:
      return [undefined, undefined]
  }
}

export function maybeFormatted(value?: string | number, valueFormatter?: ValueFormatter) {
  if (value === undefined) {
    return value
  }

  if (valueFormatter) {
    return valueFormatter(value)
  }

  return value
}

export interface ChartTooltipProps extends TooltipProps {
  valueFormatter: (value: number | string) => string
}

export function ChartTooltip({ active, payload, label, valueFormatter, labelFormatter }: ChartTooltipProps) {
  if (!active || !label || !payload) {
    return null
  }

  const formattedLabel = labelFormatter ? labelFormatter(label) : label

  const tooltipItems = payload.map(
    (payloadItem): TooltipItem => {
      const value = payloadItem.value !== undefined ? (payloadItem.value as string | number) : 0
      const [lower, upper] =
        typeof payloadItem.dataKey === 'string' ? dispatch(payloadItem.dataKey, payloadItem) : [undefined, undefined]

      return {
        name: payloadItem.name,
        color:
          payloadItem.color ||
          ((payloadItem.dataKey as string) in colors ? colors[payloadItem.dataKey as string] : '#bbbbbb'),
        key: (payloadItem.dataKey as string) || payloadItem.name,
        value: maybeFormatted(value),
        lower: maybeFormatted(lower),
        upper: maybeFormatted(upper),
      }
    },
  )

  return <ResponsiveTooltipContent formattedLabel={formattedLabel} tooltipItems={tooltipItems} />
}
