import React from 'react'
import { TooltipProps } from 'recharts'
import { useTranslation } from 'react-i18next'

import { linesToPlot, observationsToPlot, translatePlots } from './ChartCommon'
import { ResponsiveTooltipContent, TooltipItem } from './ResponsiveTooltipContent'

interface LinePlotItem extends TooltipItem {
  displayUndefinedAs: string | number
}

export interface R0PlotTooltipProps extends TooltipProps {
  valueFormatter: (value: number | string) => string
  itemsToDisplay?: string[]
}

export function LinePlotTooltip({
  active,
  payload,
  label,
  valueFormatter,
  labelFormatter,
  itemsToDisplay,
}: R0PlotTooltipProps) {
  const { t } = useTranslation()

  if (!active || !label || !payload || payload.length <= 2) {
    // The tooltip gets some odd payloads intermittently
    // https://github.com/neherlab/covid19_scenarios/issues/234#issuecomment-611279609
    return null
  }

  const formattedLabel = labelFormatter ? labelFormatter(label) : label

  const uncertainty: Record<string, [number, number]> = {}
  payload.forEach((item) => {
    if (item.name && item.name.includes(' uncertainty')) {
      const relatedItemName = item.name.replace(' uncertainty', '')
      uncertainty[relatedItemName] = [(item.value as number[])[0], (item.value as number[])[1]]
    }
  })

  const tooltipItems = []
    .concat(
      translatePlots(t, observationsToPlot()).map((observationToPlot) => ({
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
          lower:
            tooltipItem.name in uncertainty && typeof value === 'number'
              ? valueFormatter(uncertainty[tooltipItem.name][0])
              : undefined,
          upper:
            tooltipItem.name in uncertainty && typeof value === 'number'
              ? valueFormatter(uncertainty[tooltipItem.name][1])
              : undefined,
        }
      },
    )
    .filter((tooltipItem) => (tooltipItem.name ? !tooltipItem.name.includes('uncertainty') : true))

  return <ResponsiveTooltipContent formattedLabel={formattedLabel} tooltipItems={tooltipItems} />
}

function round(value: number): number {
  return Math.round(100 * value) / 100
}

export function R0PlotTooltip({
  active,
  payload,
  label,
  valueFormatter,
  labelFormatter,
  itemsToDisplay,
}: R0PlotTooltipProps) {
  if (!active || !label || !payload || !itemsToDisplay || payload.length <= 2) {
    // The tooltip gets some odd payloads intermittently
    // https://github.com/neherlab/covid19_scenarios/issues/234#issuecomment-611279609
    return null
  }
  const formattedLabel = labelFormatter ? labelFormatter(label) : label
  const datum = payload.find((elt) => typeof elt.dataKey === 'string' && itemsToDisplay.includes(elt.dataKey))
  if (!datum) {
    return null
  }

  const tooltipItem: TooltipItem = {
    key: 'r0',
    name: 'effective reproductive number',
    color: datum.color || '#883322',
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    value: valueFormatter ? valueFormatter(round(datum.payload.median)) : round(datum.payload.median),
    lower: valueFormatter ? valueFormatter(round(datum.payload.range[0])) : round(datum.payload.range[0]),
    upper: valueFormatter ? valueFormatter(round(datum.payload.range[1])) : round(datum.payload.range[1]),
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
  }

  return <ResponsiveTooltipContent formattedLabel={formattedLabel} tooltipItems={[tooltipItem]} />
}
