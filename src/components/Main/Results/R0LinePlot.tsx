import React from 'react'

import {
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  Area,
  Tooltip,
  TooltipProps,
  LabelFormatter,
  Coordinate,
  ComposedChart,
} from 'recharts'

import { useTranslationSafe } from 'src/helpers/useTranslationSafe'
import { TimeSeriesWithRange } from '../../../algorithms/types/Result.types'
import { R0PlotTooltip } from './LinePlotTooltip'

export interface R0PlotProps {
  R0Trajectory: TimeSeriesWithRange
  width: number
  height: number
  tMin: number
  tMax: number
  labelFormatter: LabelFormatter
  tooltipPosition?: Coordinate
  tooltipValueFormatter: (value: number | string) => string
}

export function R0Plot({
  R0Trajectory,
  width,
  height,
  tMin,
  tMax,
  labelFormatter,
  tooltipPosition,
  tooltipValueFormatter,
}: R0PlotProps) {
  const { t } = useTranslationSafe()

  const plotData = R0Trajectory.mean.map((d, i) => {
    return {
      time: d.t,
      one: 1.0,
      median: d.y,
      range: [R0Trajectory.lower[i].y, R0Trajectory.upper[i].y],
    }
  })
  const R0Color = '#883322'
  const dataMax = Math.ceil(Math.max(...plotData.map((d) => d.range[1])))

  let tooltipItems: { [key: string]: number | number[] | undefined } = {}
  plotData.forEach((d) => {
    tooltipItems = { ...tooltipItems, ...d }
  })

  const tooltipItemToDisplay = ['median'] // eslint-disable-line i18next/no-literal-string

  return (
    <ComposedChart
      width={width}
      height={height}
      data={plotData}
      margin={{
        left: 5,
        right: 5,
        top: 0,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        allowDataOverflow
        dataKey="time"
        type="number"
        domain={[tMin, tMax]}
        tickFormatter={() => ''}
        tickCount={7}
      />
      <YAxis
        yAxisId="R0Axis"
        allowDataOverflow
        orientation={'left'}
        type="number"
        label={{ value: t('Rt'), angle: -90, dx: -12, fill: '#495057' }}
        domain={[0, dataMax]}
      />
      <Tooltip
        labelFormatter={labelFormatter}
        position={tooltipPosition}
        content={(props: TooltipProps) => (
          <R0PlotTooltip valueFormatter={tooltipValueFormatter} itemsToDisplay={tooltipItemToDisplay} {...props} />
        )}
      />
      <Line
        key={'median'}
        dot={false}
        isAnimationActive={false}
        type="monotone"
        strokeWidth={3}
        dataKey={'median'}
        stroke={R0Color}
        name={t('Average R0')}
        yAxisId="R0Axis"
      />
      <Line
        key={'one'}
        dot={false}
        isAnimationActive={false}
        type="monotone"
        strokeWidth={3}
        dataKey={'one'}
        stroke={'#ccc'}
        yAxisId="R0Axis"
      />
      <Area
        key={'range'}
        type="monotone"
        fillOpacity={0.075}
        dataKey={'range'}
        isAnimationActive={false}
        name={t('R0 range')}
        stroke={R0Color}
        strokeWidth={0}
        fill={R0Color}
        yAxisId="R0Axis"
      />
    </ComposedChart>
  )
}
