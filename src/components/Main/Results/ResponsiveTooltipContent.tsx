import React, { ReactNode } from 'react'
import { TooltipProps } from 'recharts'
import { useTranslation } from 'react-i18next'

import { linesToPlot, observationsToPlot, translatePlots, LineProps } from './LinePlotCommon'

import './ResponsiveTooltipContent.scss'

interface TooltipItem extends LineProps {
  value: React.ReactNode
  displayUndefinedAs: number | string
}

interface ResponsiveTooltipContentProps extends TooltipProps {
  valueFormatter: (value: number | string) => string
  itemsToDisplay?: string[]
}

export function ResponsiveTooltipContent({
  active,
  payload,
  label,
  valueFormatter,
  labelFormatter,
  itemsToDisplay,
}: ResponsiveTooltipContentProps) {
  const { t } = useTranslation()

  if (!active || !label || !payload || payload.length <= 2) {
    return null
  }

  const formattedLabel = labelFormatter && label !== undefined ? labelFormatter(label) : '-'

  const tooltipItems: TooltipItem[] = []
    .concat(
      translatePlots(t, observationsToPlot).map((observationToPlot) => ({
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
      (tooltipItem: TooltipItem): boolean =>
        !itemsToDisplay || !!itemsToDisplay.find((itemKey) => itemKey === tooltipItem.key),
    )
    .map(
      (tooltipItem: TooltipItem): TooltipItem => {
        const payloadItem = payload.find((payloadItem) => payloadItem.dataKey === tooltipItem.key)

        const value =
          // eslint-disable-next-line unicorn/no-nested-ternary
          payloadItem && payloadItem.value !== undefined
            ? (payloadItem.value as string | number)
            : tooltipItem.displayUndefinedAs

        return {
          ...tooltipItem,
          value: valueFormatter ? valueFormatter(value) : value,
        }
      },
    )

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
