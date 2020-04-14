import React from 'react'
import { TooltipProps } from 'recharts'
import { useTranslation } from 'react-i18next'

import { linesToPlot, observationsToPlot, translatePlots } from './ChartCommon'
import { ResponsiveTooltipContent, TooltipItem } from './ResponsiveTooltipContent'

import './ResponsiveTooltipContent.scss'

interface LinePlotItem extends TooltipItem {
  displayUndefinedAs: string | number
}

export interface LinePlotTooltipProps extends TooltipProps {
  valueFormatter: (value: number | string) => string
  itemsToDisplay?: string[]
  deltaCaseDays: number
}

export function LinePlotTooltip({
  active,
  payload,
  label,
  valueFormatter,
  labelFormatter,
  itemsToDisplay,
  deltaCaseDays,
}: LinePlotTooltipProps) {
  const { t } = useTranslation()

  if (!active || !label || !payload || payload.length <= 2) {
    // The tooltip gets some odd payloads intermitttently
    // https://github.com/neherlab/covid19_scenarios/issues/234#issuecomment-611279609
    return null
  }

  const formattedLabel = labelFormatter ? labelFormatter(label) : label

  const uncertainty: Record<string, [number, number]> = {}
  payload.forEach((item) => {
    if (item.name && item.name.includes(' uncertainty')) {
      const key = item.name.replace(' uncertainty', '')
      uncertainty[key] = [item.value[0], item.value[1]]
    }
  })

  const tooltipItems = []
    .concat(
      translatePlots(t, observationsToPlot(deltaCaseDays)).map((observationToPlot) => ({
        ...observationToPlot,
        displayUndefinedAs: '-',
      })) as never,
    )
    .concat(
      translatePlots(t, linesToPlot).map((lineToPlot) => ({
        ...lineToPlot,
        displayUndefinedAs: 0,
      })) as never,
    )
    .filter(
      (tooltipItem: LinePlotItem): boolean =>
        !itemsToDisplay || !!itemsToDisplay.find((itemKey) => itemKey === tooltipItem.key),
    )
    .map(
      (tooltipItem: LinePlotItem): LinePlotItem => {
        const payloadItem = payload.find((payloadItem) => payloadItem.dataKey === tooltipItem.key)

        const value =
          payloadItem && payloadItem.value !== undefined
            ? (payloadItem.value as string | number)
            : tooltipItem.displayUndefinedAs

        return {
          ...tooltipItem,
          value: valueFormatter ? valueFormatter(value) : value,
        }
      },
    )
    .map((payloadItem) => ({
      name: payloadItem.name,
      color: payloadItem.color || '#bbbbbb',
      value: valueFormatter ? valueFormatter(payloadItem.value) : payloadItem.value,
      lower:
        payloadItem.name in uncertainty
          ? valueFormatter(payloadItem.value - uncertainty[payloadItem.name][0])
          : undefined,
      upper:
        payloadItem.name in uncertainty
          ? valueFormatter(uncertainty[payloadItem.name][1] - payloadItem.value)
          : undefined,
    }))
    .filter((payloadItem) => (payloadItem.name ? !payloadItem.name.includes('uncertainty') : true))

  return <ResponsiveTooltipContent formattedLabel={formattedLabel} tooltipItems={tooltipItems} />
}
