import React from 'react'

import _ from 'lodash'

import { CartesianGrid, XAxis, YAxis, Line, Area, ComposedChart } from 'recharts'
import { TimeSeriesWithRange } from '../../../algorithms/types/Result.types'

export interface R0PlotProps {
  R0Trajectory: TimeSeriesWithRange
  width: number
  height: number
  tMin: number
  tMax: number
}

export function R0Plot({ R0Trajectory, width, height, tMin, tMax }: R0PlotProps) {
  const plotData = R0Trajectory.mean.map((d, i) => {
    return {
      time: d.t,
      one: 1.0,
      mean: d.y,
      range: [R0Trajectory.lower[i].y, R0Trajectory.upper[i].y],
    }
  })
  const R0Color = '#883322'
  const dataMax = Math.ceil(Math.max(...plotData.map((d) => d.range[1])))

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
        label={{ value: 'Rt', angle: -90 }}
        domain={[0, dataMax]}
      />
      <Line
        key={'mean'}
        dot={false}
        isAnimationActive={false}
        type="monotone"
        strokeWidth={3}
        dataKey={'mean'}
        stroke={R0Color}
        name={'Average R0'}
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
        name={'R0 range'}
        stroke={R0Color}
        strokeWidth={0}
        fill={R0Color}
        yAxisId="R0Axis"
      />
    </ComposedChart>
  )
}
